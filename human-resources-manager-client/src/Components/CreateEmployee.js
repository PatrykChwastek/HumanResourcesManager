import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { APIURL, DarkTextField, DarkSelect, DarkChipList } from './GlobalComponents';

import Button from '@material-ui/core/Button';

import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns'

import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

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
        gridTemplateColumns: "1fr 1fr 1fr",
        justifyContent: "space-between",
        alignContent: "space-between",
        gridGap: "1.2rem 1.2rem",
    },
    datePicker: {
        marginTop: '0',
        marginLeft: "20px"
    },
    createButton: {
        margin: '0 auto',
        display: 'block',
        width: "19rem",
    }
}));

const CreateEmploy = () => {
    const classes = useStyles();
    const [employee, setEmployee] = useState({
        id: 0,
        employmentDate: format(new Date(), "yyy-MM-dd"),
        remoteWork: false,
        person: {
            id: 0,
            name: "",
            surname: "",
            phoneNumber: "",
            email: "",
            employeeAddress: {
                id: 0,
                city: "",
                postCode: "",
                street: ""
            }
        },
        position: {
            id: 0,
            name: "",
        },
        department: {
            id: 0,
            name: "",
        },
        permissions: []
    });
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const remoteWork = [
        { id: false, name: "Office" },
        { id: true, name: "Remote" }
    ];
    const [allPermissions, setAllPermissions] = useState([]);
    const [employeePermissions, setEmployeePermissions] = useState([]);
    useEffect(() => {
        getEmployeeProps()
    }, []);

    useEffect(() => {
        setEmployee({
            ...employee,
            ['permissions']: employeePermissions
        })
    }, [employeePermissions]);

    const PostEmployee = (formData) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        };
        fetch(APIURL + 'employee/create', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const getEmployeeProps = async () => {
        const requestOptions = {
            method: 'Get',
        };
        await fetch(APIURL + `departments`,
            requestOptions
        )
            .then(response => response.json())
            .then(data => setDepartments(data));

        await fetch(APIURL + `positions`,
            requestOptions
        )
            .then(response => response.json())
            .then(data => setPositions(data));

        await fetch(APIURL + `permissions`,
            requestOptions
        )
            .then(response => response.json())
            .then(data => setAllPermissions(data));
    }

    const headleFormChange = e => {

        if (e.target.name === "permissionSelect") {
            if (employeePermissions.length === 0) {
                setEmployeePermissions([e.target.value]);
            } else {
                let isPicked = false;
                employeePermissions.forEach(element => {
                    if (element.id === e.target.value.id) {
                        isPicked = true;
                    }
                });
                if (!isPicked) {
                    setEmployeePermissions([...employeePermissions, e.target.value]);
                }
            }
        }

        setEmployee({
            id: 0,
            person: {
                id: 0,
                name: e.target.name === "employeeName" ? e.target.value : employee.person.name,
                surname: e.target.name === "employeeSurname" ? e.target.value : employee.person.surname,
                phoneNumber: "12345678",
                email: "t@gt.comm",
                employeeAddress: {
                    id: 0,
                    city: e.target.name === "employeeCity" ? e.target.value : employee.person.employeeAddress.city,
                    postCode: e.target.name === "employeePostCode" ? e.target.value : employee.person.employeeAddress.postCode,
                    street: e.target.name === "employeeStreet" ? e.target.value : employee.person.employeeAddress.street
                }
            },
            position: e.target.name === "positionSelect" ? e.target.value : employee.position,
            department: e.target.name === "departmentSelect" ? e.target.value : employee.department,
            employmentDate: employee.employmentDate,
            remoteWork: e.target.name === "remoteWork" ? e.target.value.id : employee.remoteWork,
            permissions: employee.permissions
        })
    }

    const headleDateChange = (e) => {
        setEmployee({ ...employee, employmentDate: e })
    }
    const hendlePermissionDelete = chipToDelete => {
        setEmployeePermissions(chips => chips.filter(chip => chip.name !== chipToDelete.name));
    }

    const hendlePostEmployee = () => {
        console.log(employee);
        PostEmployee(employee);
    }

    return (
        <div className={classes.mainConteiner}>
            <div boxShadow={2} className={classes.title}>
                <h3 >Create new employee</h3>
            </div>
            <form className={classes.root} noValidate autoComplete="off">
                <div className={classes.formGrid}>
                    <DarkTextField
                        label="Name"
                        name="employeeName"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Surname"
                        name="employeeSurname"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Phone Number"
                        name="employeePhone"
                        type="tel"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Email"
                        name="employeeEmail"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="City"
                        name="employeeCity"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Post Code"
                        name="employeePostCode"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Street"
                        name="employeeStreet"
                        onChange={headleFormChange}
                    />
                    <DarkSelect
                        label="Department"
                        name="departmentSelect"
                        collection={departments}
                        onChange={headleFormChange}
                    />
                    <DarkSelect
                        label="Position"
                        name="positionSelect"
                        collection={positions}
                        onChange={headleFormChange}
                    />
                    <DarkSelect
                        label="Work Type"
                        name="remoteWork"
                        collection={remoteWork}
                        value={employee.remoteWork === false ? remoteWork[0] : remoteWork[1]}
                        onChange={headleFormChange}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            className={classes.datePicker}
                            disableToolbar
                            name="datePicker"
                            variant="inline"
                            format="yyyy-MM-dd"
                            margin="normal"
                            id="date-picker-inline"
                            label="Employment Date"
                            value={employee.employmentDate}
                            onChange={headleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <DarkChipList
                    label="Permissions"
                    name="permissionSelect"
                    collection={allPermissions}
                    clipListCollection={employeePermissions}
                    onChange={headleFormChange}
                    onDelete={hendlePermissionDelete}
                />
                <Button
                    className={classes.createButton}
                    variant="contained"
                    color="primary"
                    onClick={hendlePostEmployee}
                >Create</Button>
            </form>
        </div>
    );
}
export default CreateEmploy;