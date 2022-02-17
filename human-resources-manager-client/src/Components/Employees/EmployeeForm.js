import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect, DarkChipList } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import { useLocation } from "react-router-dom";
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

const EmployeeForm = () => {
    const classes = useStyles();
    const location = useLocation();
    const [seniorityLvs] = useState([
        { id: 1, name: "Junior" },
        { id: 2, name: "Regular" },
        { id: 3, name: "Senior" },
    ]);
    const [employee, setEmployee] = useState(
        location.employee !== undefined ? location.employee.employee :
            {
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
                seniority: "",
                permissions: []
            });
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const remoteWork = [
        { id: false, name: "Office" },
        { id: true, name: "Remote" }
    ];
    const [allPermissions, setAllPermissions] = useState([]);
    const [employeePermissions, setEmployeePermissions] = useState(
        location.employee !== undefined ? location.employee.employee.permissions : []
    );

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

    const PutEmployee = (id, formData) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        };
        fetch(APIURL + 'employee/put/' + id, requestOptions)
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
            ...employee,
            person: {
                ...employee.person,
                name: e.target.name === "employeeName" ? e.target.value : employee.person.name,
                surname: e.target.name === "employeeSurname" ? e.target.value : employee.person.surname,
                phoneNumber: e.target.name === "employeePhone" ? e.target.value : employee.person.phoneNumber,
                email: e.target.name === "employeeEmail" ? e.target.value : employee.person.email,
                employeeAddress: {
                    ...employee.person.employeeAddress,
                    city: e.target.name === "employeeCity" ? e.target.value : employee.person.employeeAddress.city,
                    postCode: e.target.name === "employeePostCode" ? e.target.value : employee.person.employeeAddress.postCode,
                    street: e.target.name === "employeeStreet" ? e.target.value : employee.person.employeeAddress.street
                }
            },
            position: e.target.name === "positionSelect" ? e.target.value : employee.position,
            department: e.target.name === "departmentSelect" ? e.target.value : employee.department,
            employmentDate: employee.employmentDate,
            remoteWork: e.target.name === "remoteWork" ? e.target.value.id : employee.remoteWork,
            seniority: e.target.name === "seniority" ? e.target.value.name : employee.seniority,
            permissions: employee.permissions
        })
    }

    const headleDateChange = (e) => {
        setEmployee({ ...employee, employmentDate: e })
    }
    const hendlePermissionDelete = chipToDelete => {
        setEmployeePermissions(chips => chips.filter(chip => chip.name !== chipToDelete.name));
    }

    const hendleSubmitEmployee = () => {
        console.log(employee);
        if (location.employee !== undefined) {
            PutEmployee(employee.id, employee)
            return;
        }
        PostEmployee(employee);
    }

    const setSelectVall = (colection, objId) => {
        if (colection[0] === undefined || objId === 0)
            return '';

        return colection[colection.findIndex((item) => item.id === objId)];
    }

    return (
        <div className={classes.mainConteiner}>
            <div boxshadow={2} className={classes.title}>
                {employee.id !== 0 ?
                    <h3 >{'Edit Employee: ' + employee.id}</h3> :
                    <h3 >Create New Employee</h3>
                }
            </div>
            <form className={classes.root} noValidate autoComplete="off">
                <div className={classes.formGrid}>
                    <DarkTextField
                        label="Name"
                        name="employeeName"
                        value={employee.person.name}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Surname"
                        name="employeeSurname"
                        value={employee.person.surname}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Phone Number"
                        name="employeePhone"
                        type="tel"
                        value={employee.person.phoneNumber}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Email"
                        name="employeeEmail"
                        value={employee.person.email}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="City"
                        name="employeeCity"
                        value={employee.person.employeeAddress.city}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Post Code"
                        name="employeePostCode"
                        value={employee.person.employeeAddress.postCode}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Street"
                        name="employeeStreet"
                        value={employee.person.employeeAddress.street}
                        onChange={headleFormChange}
                    />
                    <DarkSelect
                        label="Department"
                        name="departmentSelect"
                        collection={departments}
                        value={setSelectVall(departments, employee.department.id)}
                        onChange={headleFormChange}
                    />
                    <DarkSelect
                        label="Position"
                        name="positionSelect"
                        collection={positions}
                        value={setSelectVall(positions, employee.position.id)}
                        onChange={headleFormChange}
                    />
                    <DarkSelect
                        label="Seniority"
                        name="seniority"
                        collection={seniorityLvs}
                        value={
                            seniorityLvs[seniorityLvs.findIndex((item) => item.name === employee.seniority)]} //sen
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
                    onClick={hendleSubmitEmployee}
                >Submit </Button>
            </form>
        </div>
    );
}
export default EmployeeForm;