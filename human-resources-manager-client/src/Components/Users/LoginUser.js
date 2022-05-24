import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { DarkTextField } from '../GlobalComponents';
import APIURL from '../../Services/Globals';
import AuthService from '../../Services/AuthService'
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    mainConteiner: {
        margin: "0 auto",
        marginTop: "38px",
        width: "32rem",
        background: theme.palette.grey[800],
        paddingBottom: '25px',
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '1px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
    },
    formGrid: {
        margin: "20px",
        display: "grid",
        gridGap: "1.2rem",
    },
    createButton: {
        margin: '8px auto',
        fontSize: '16px',
        fontWeight: 550,
        display: 'block',
        width: "22rem",
    }, backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        backgroundColor: "rgb(0 0 0 / 60%)",
        display: "flex",
        flexDirection: "column",
        "& h1": {
            margin: "18px"
        }
    },
}));

const LoginUser = () => {
    const classes = useStyles();
    const history = useHistory();
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState({ open: false, text: "Login..." });
    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
    });

    const headleFormChange = e => {
        setLoginData({
            username: e.target.name === "username" ? e.target.value : loginData.username,
            password: e.target.name === "password" ? e.target.value : loginData.password
        })
    }

    const hendleLogin = (event) => {
        event.preventDefault()
        setLoading({ open: true, text: "Login..." });
        AuthService.login(loginData).then((data) => {
            GenerateTasks();
        }, e => {
            setAllertProps({
                text: 'Login Error!',
                open: true,
                type: 'error'
            });
            setLoading({ open: false, text: "" });
        });
    }

    const GenerateTasks = () => {
        setLoading({ open: true, text: "Generate Tasks..." });
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json' })
        };
        fetch(APIURL + "home/generate-tasks", requestOptions)
            .then(data => {
                setLoading({ open: false, text: "" })
                history.push("/main/tasks-columns");
                console.log(data)
            }, err => { console.log(err) });
    }

    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    return (
        <div className={classes.mainConteiner}>
            <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                <Alert onClose={handleAllertClose} severity={allertProps.type}>
                    {allertProps.text}
                </Alert>
            </Snackbar>
            <Backdrop className={classes.backdrop} open={loading.open}>
                <h1>{loading.text}</h1>
                <CircularProgress style={{ width: "60px", height: "60px" }} color="inherit" />
            </Backdrop>
            <div boxshadow={2} className={classes.title}>
                <h2>User Credentials:</h2>
            </div>
            <form onSubmit={hendleLogin} className={classes.root} noValidate autoComplete="off">
                <div className={classes.formGrid}>
                    <DarkTextField
                        label="Username"
                        name="username"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Password"
                        name="password"
                        type="password"
                        onChange={headleFormChange}
                    />
                </div>
                <Button
                    className={classes.createButton}
                    variant="contained"
                    color="primary"
                    type="submit"
                >Login</Button>
            </form>
        </div>
    );
}
export default LoginUser;