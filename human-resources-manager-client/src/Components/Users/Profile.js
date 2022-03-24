import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import AuthService, { getCurrentUser } from '../../Services/AuthService';

import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    formConteiner: {
        marginTop: "1.2rem",
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
    usernameBox: {
        display: "flex",
        flexDirection: "row",
        '& .MuiFormControl-root': {
            width: '100%',
        }
    },
    formText: {
        color: 'white',
        margin: '20px 18px 6px'
    },
    formButton: {
        alignSelf: "flex-start",
        padding: '8px 25px',
        marginTop: '12px',
        marginLeft: '18px',
        marginRight: '10px'
    },
    permissionsDisplay: {
        display: "flex",
        margin: '18px',

        '& .MuiChip-root': {
            marginRight: '12px',
        }
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        justifyContent: "space-between",
        alignContent: "space-between",
        gridGap: "1.2rem 1.2rem",
    },
    infoText: {
        color: "white",
        margin: '4px 18px',
        fontSize: '18px',
        fontWeight: 500,
        width: 'fit-content',
        '& span': {
            marginLeft: '5px',
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 400,
        }
    }
}));

const Profile = () => {
    const classes = useStyles();
    const [user, setUser] = useState(getCurrentUser().userDetails);
    const [userCredentials, setUserCredentials] = useState({
        isChangePassword: false,
        isUsernameChanged: false,
        username: '',
        oldPass: '',
        newPass: ''
    });

    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
    });

    const onUsernameConfirm = () => {
        if (userCredentials.isUsernameChanged) {
            putUser(userCredentials.username);
        }
    }

    const onPasswordConfirm = () => {
        if (userCredentials.isChangePassword) {
            changePassword();
        }
    }

    const putUser = (newUsername) => {
        const requestOptions = {
            method: 'Put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: user.id,
                username: newUsername === undefined ?
                    user.username : newUsername,
                password: user.password,
                employeeDTO: user.employeeDTO
            }),
        };
        fetch(APIURL + 'users/' + user.id, requestOptions)
            .then((res) => {
                if (res.status >= 400) {
                    console.log(res)
                    setAllertProps({
                        text: "Error",
                        open: true,
                        type: "error"
                    })
                    return;
                }
                setAllertProps({
                    text: newUsername === undefined ?
                        "User Data Changed" : "Username Changed",
                    open: true,
                    type: "success"
                });
                AuthService.login({
                    username: userCredentials.isUsernameChanged ?
                        newUsername : user.username,
                    password: user.password
                }).then((data) => {
                    setUserCredentials({
                        ...userCredentials,
                        isUsernameChanged: false,
                        username: '',
                    });
                    setUser(getCurrentUser().userDetails)
                }, e => { console.log("login error") });
            });
    }

    const changePassword = () => {
        if (userCredentials.oldPass === '' &&
            userCredentials.newPass === '') {
            setUserCredentials({
                ...userCredentials,
                isChangePassword: false,
            })
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                oldPassword: userCredentials.oldPass,
                newPassword: userCredentials.newPass
            }),
        };
        fetch(APIURL + 'users/change-pass', requestOptions)
            .then((res) => {
                if (res.status >= 400) {
                    console.log(res)
                    setAllertProps({
                        text: "Error",
                        open: true,
                        type: "error"
                    })
                    return;
                }
                setAllertProps({
                    text: "Password Changed",
                    open: true,
                    type: "success"
                });
            }).then(() => {
                AuthService.login({
                    username: user.username,
                    password: userCredentials.newPass
                }).then((data) => {
                    setUserCredentials({
                        ...userCredentials,
                        isChangePassword: false,
                        oldPass: '',
                        newPass: ''
                    });
                    setUser(getCurrentUser().userDetails)
                }, e => { console.log("login error") });
            });
    }

    const onUsernameChange = (e) => {
        const usernameVal = e.target.value

        if (usernameVal === user.username) {
            setUserCredentials({
                ...userCredentials,
                isUsernameChanged: false,
            })

            return;
        }

        setUserCredentials({
            ...userCredentials,
            username: usernameVal,
            isUsernameChanged: true,
        })
    }

    const headleFormChange = (e) => {
        setUser({
            ...user,
            employeeDTO: {
                ...user.employeeDTO,
                person: {
                    ...user.employeeDTO.person,
                    name: e.target.name === "employeeName" ?
                        e.target.value : user.employeeDTO.person.name,
                    surname: e.target.name === "employeeSurname" ?
                        e.target.value : user.employeeDTO.person.surname,
                    phoneNumber: e.target.name === "employeePhone" ?
                        e.target.value : user.employeeDTO.person.phoneNumber,
                    email: e.target.name === "employeeEmail" ?
                        e.target.value : user.employeeDTO.person.email,
                    employeeAddress: {
                        ...user.employeeDTO.person.employeeAddress,
                        city: e.target.name === "employeeCity" ?
                            e.target.value : user.employeeDTO.person.employeeAddress.city,
                        postCode: e.target.name === "employeePostCode" ?
                            e.target.value : user.employeeDTO.person.employeeAddress.postCode,
                        street: e.target.name === "employeeStreet" ?
                            e.target.value : user.employeeDTO.person.employeeAddress.street
                    }
                },
            }
        });
    }

    const handleDataConfirm = () => {
        putUser();
    }

    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    return (
        <React.Fragment>
            <div className={classes.formConteiner}>
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
                        <div className={classes.usernameBox}>
                            <DarkTextField
                                label="Username"
                                defaultValue={user.username}
                                onChange={onUsernameChange}
                            />
                            {!userCredentials.isUsernameChanged ? null :
                                <Button
                                    className={classes.formButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={onUsernameConfirm}
                                >Confirm</Button>
                            }
                        </div>
                        <h3 className={classes.formText}>Password:</h3>
                        {!userCredentials.isChangePassword ?
                            <Button
                                className={classes.formButton}
                                variant="contained"
                                color="primary"
                                onClick={() => setUserCredentials({ ...userCredentials, isChangePassword: true })}
                            >Change Password</Button> :
                            <React.Fragment>
                                <DarkTextField
                                    label="Old Password"
                                    type={'password'}
                                    value={userCredentials.oldPass}
                                    onChange={(e) =>
                                        setUserCredentials({
                                            ...userCredentials,
                                            oldPass: e.target.value,
                                            isChangePassword: true
                                        })
                                    }
                                />
                                <DarkTextField
                                    label="New Password"
                                    type={'password'}
                                    value={userCredentials.newPass}
                                    onChange={(e) =>
                                        setUserCredentials({
                                            ...userCredentials,
                                            newPass: e.target.value,
                                            isChangePassword: true
                                        })
                                    }
                                />
                            </React.Fragment>
                        }
                        {!userCredentials.isChangePassword ? null :
                            <Button
                                className={classes.formButton}
                                variant="contained"
                                color="primary"
                                onClick={onPasswordConfirm}
                            >Confirm</Button>
                        }

                    </div>
                </form>
            </div>
            <div className={classes.formConteiner}>
                <div boxshadow={2} className={classes.title}>
                    <h3 >User Data</h3>
                </div>
                {user.employeeDTO.permissions.length === 0 ? null :
                    <React.Fragment>
                        <h3 className={classes.formText}>Your Permissions: </h3>
                        <div className={classes.permissionsDisplay}>
                            {user.employeeDTO.permissions.map((permition, index) => (
                                <Chip
                                    className={classes.permitionChip}
                                    key={index}
                                    label={permition.name}
                                    color="primary"
                                />

                            ))}
                        </div>
                    </React.Fragment>
                }
                <form noValidate autoComplete="off" className={classes.formGrid}>
                    {user.employeeDTO === undefined ? null :
                        <React.Fragment>
                            <p className={classes.infoText}>{'Employment Date: '} <span>{user.employeeDTO.employmentDate.toString().split('T')[0]}</span></p>
                            <p className={classes.infoText}>{'Work Type: '} <span>{user.employeeDTO.remoteWork ? 'Office' : 'Remote'}</span></p>
                            <p className={classes.infoText}>{'Seniority: '} <span>{user.employeeDTO.seniority}</span></p>
                            <p className={classes.infoText}>{'Position: '} <span>{user.employeeDTO.position.name}</span></p>
                            <p className={classes.infoText}>{'Department: '} <span>{user.employeeDTO.department.name}</span></p><div></div>
                        </React.Fragment>
                    }
                    <DarkTextField
                        label="Name"
                        name="employeeName"
                        value={user.employeeDTO.person.name}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Surname"
                        name="employeeSurname"
                        value={user.employeeDTO.person.surname}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Phone Number"
                        name="employeePhone"
                        type="tel"
                        value={user.employeeDTO.person.phoneNumber}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Email"
                        name="employeeEmail"
                        value={user.employeeDTO.person.email}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="City"
                        name="employeeCity"
                        value={user.employeeDTO.person.employeeAddress.city}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Post Code"
                        name="employeePostCode"
                        value={user.employeeDTO.person.employeeAddress.postCode}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Street"
                        name="employeeStreet"
                        value={user.employeeDTO.person.employeeAddress.street}
                        onChange={headleFormChange}
                    />
                </form>
                <Button
                    className={classes.formButton}
                    variant="contained"
                    color="primary"
                    onClick={handleDataConfirm}
                >Confirm</Button>
            </div>
        </React.Fragment>
    );
}
export default Profile;