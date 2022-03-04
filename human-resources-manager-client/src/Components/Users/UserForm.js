import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect } from '../GlobalComponents';
import EmployeeForm from '../Employees/EmployeeForm'
import { useLocation } from "react-router-dom";
import APIURL from '../../Services/Globals'

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    mainConteiner: {
        marginTop: "1.8rem",
        background: theme.palette.grey[800],
        paddingBottom: '20px'
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '1px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        justifyContent: "space-between",
        alignContent: "space-between",
    },
}));

const UserForm = () => {
    const classes = useStyles();
    const location = useLocation();
    const [user, setUser] = useState(location.user !== undefined ? location.user.user : {});
    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
    });

    const PostUser = (employee) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                employeeDTO: employee
            }),
        };

        fetch(APIURL + 'users', requestOptions)
            .then(response => response.json())
            .then(() => {
                setAllertProps({
                    text: "User Created",
                    open: true,
                    type: "success"
                })
            }
                , (err) => {
                    console.log(err)
                    setAllertProps({
                        text: "User Creation Error!",
                        open: true,
                        type: "error"
                    })
                });
    }

    const hendleEmployeeCreations = (employee) => {
        PostUser(employee);
    }

    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    return (
        <div>
            <div className={classes.mainConteiner}>
                <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                    <Alert onClose={handleAllertClose} severity={allertProps.type}>
                        {allertProps.text}
                    </Alert>
                </Snackbar>
                <div boxshadow={2} className={classes.title}>
                    <h3 >User Credentials</h3>
                </div>
                <form noValidate autoComplete="off">
                    <div className={classes.formGrid}>
                        <DarkTextField
                            label="Username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                        />
                        <DarkTextField
                            label="Password"
                            type={'password'}
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                    </div>

                </form>
            </div>
            {location.user !== undefined ?
                <EmployeeForm
                    createdEmployee={hendleEmployeeCreations}
                    employeeToEdit={location.user.user.employeeDTO}
                /> :
                <EmployeeForm createdEmployee={hendleEmployeeCreations} />
            }
        </div>
    )
}
export default UserForm;