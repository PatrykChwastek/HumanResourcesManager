import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { DarkTextField } from './GlobalComponents';
import AuthService from '../Services/AuthService'
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    mainConteiner: {
        margin: "0 auto",
        marginTop: "28px",
        width: "22rem",
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
        margin: '0 auto',
        display: 'block',
        width: "18rem",
    }
}));

const LoginUser = () => {
    const classes = useStyles();
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });
    const history = useHistory();

    const headleFormChange = e => {
        setLoginData({
            username: e.target.name === "username" ? e.target.value : loginData.username,
            password: e.target.name === "password" ? e.target.value : loginData.password
        })
    }

    const hendleLogin = () => {
        AuthService.login(loginData).then((data) => {
            history.push("/main");
        }, e => { console.log("login error") });
    }

    return (
        <div className={classes.mainConteiner}>
            <div boxShadow={2} className={classes.title}>
                <h2 >Login</h2>
            </div>
            <form className={classes.root} noValidate autoComplete="off">
                <div className={classes.formGrid}>
                    <DarkTextField
                        label="Username"
                        name="username"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Password"
                        name="password"
                        onChange={headleFormChange}
                    />
                </div>
                <Button
                    className={classes.createButton}
                    variant="contained"
                    color="primary"
                    onClick={hendleLogin}
                >Login</Button>
            </form>
        </div>
    );
}
export default LoginUser;