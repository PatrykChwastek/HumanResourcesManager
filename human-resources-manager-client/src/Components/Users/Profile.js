import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import { getCurrentUser } from '../../Services/AuthService';

import Button from '@material-ui/core/Button';
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
    profileForm: {
        display: "flex",
        flexDirection: "column",
        padding: '8px'
    },
    formButton: {
        alignSelf: "flex-start",
        padding: '8px 25px',
        marginTop: '12px',
        marginLeft: '18px',
    }
}));

const Profile = () => {
    const classes = useStyles();
    const [user, setUser] = useState(getCurrentUser().userDetails);
    const [changePassword, setChangePassword] = useState({
        isChangePassword: false,
        old: '',
        new: ''
    });
    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
    });

    const headleChanePassword = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                oldPassword: changePassword.old,
                newPassword: changePassword.new
            }),
        };
        fetch(APIURL + 'users/change-pass', requestOptions)
            .then(() => {
                setAllertProps({
                    text: "Password Changed",
                    open: true,
                    type: "success"
                });
                setChangePassword({
                    isChangePassword: false,
                    old: '',
                    new: ''
                })
            }
                , (err) => {
                    console.log(err)
                    setAllertProps({
                        text: "Error",
                        open: true,
                        type: "error"
                    })
                });
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
            <div boxshadow={2} className={classes.title}>
                <h3 >User Credentials</h3>
            </div>
            <form noValidate autoComplete="off">
                <div className={classes.profileForm}>
                    <DarkTextField
                        label="Username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                    {!changePassword.isChangePassword ?
                        <Button
                            className={classes.formButton}
                            variant="contained"
                            color="primary"
                            onClick={() => setChangePassword({ ...changePassword, isChangePassword: true })}
                        >Change Password</Button> :
                        <React.Fragment>
                            <DarkTextField
                                label="Old Password"
                                type={'password'}
                                value={changePassword.old}
                                onChange={(e) =>
                                    setChangePassword({ ...changePassword, old: e.target.value })
                                }
                            />
                            <DarkTextField
                                label="New Password"
                                type={'password'}
                                value={changePassword.new}
                                onChange={(e) =>
                                    setChangePassword({ ...changePassword, new: e.target.value })
                                }
                            />
                            <Button
                                className={classes.formButton}
                                variant="contained"
                                color="primary"
                                onClick={headleChanePassword}
                            >Confirm</Button>
                        </React.Fragment>
                    }

                </div>
            </form>
        </div>
    );
}
export default Profile;