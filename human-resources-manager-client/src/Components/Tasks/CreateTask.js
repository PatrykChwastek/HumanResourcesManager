import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect, DarkChipList } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import { getCurrentUser } from '../../Services/AuthService';

import Button from '@material-ui/core/Button';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import moment from "moment";

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
        gridTemplateColumns: "1fr 2fr",
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

const leaderID = getCurrentUser().userDetails.employeeDTO.id;
const CreateTask = () => {
    const classes = useStyles();
    const [task, setTask] = useState({})
    const [allEmployees, setAllEmployees] = useState([])
    const [employeesToAssign, setEmployeesToAssign] = useState([])

    useEffect(() => {
        getMembers();
    }, []);

    useEffect(() => {
        if (employeesToAssign.length === 1) {
            setTask({
                ...task,
                assignedEmployeeId: employeesToAssign[0].id,
            })
        } else
            setTask({
                ...task,
                assignedEmployeeId: 0,
            })
    }, [employeesToAssign]);

    const getMembers = () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(APIURL + `teams/leader/${leaderID}`, requestOptions)
            .then(response => response.json())
            .then(data => (
                data.members.map(member => {
                    setAllEmployees(old => [...old, {
                        id: member.id,
                        name: member.person.name + " " + member.person.surname
                    }])
                })
            ));
    }

    const PostTask = (formData) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        };
        fetch(APIURL + 'tasks', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const PostTasks = (formData) => {
        let employeesId = [];
        employeesToAssign.map(employee => {
            employeesId.push(employee.id);
        })
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                employeeTaskDTO: formData,
                employeesID: employeesId
            }),
        };
        fetch(APIURL + 'tasks/multi', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const headleFormChange = e => {
        if (e.target.name === "employeeSelect") {
            if (employeesToAssign.length === 0) {
                setEmployeesToAssign([e.target.value]);
            } else {
                let isPicked = false;
                employeesToAssign.forEach(element => {
                    if (element.id === e.target.value.id) {
                        isPicked = true;
                    }
                });
                if (!isPicked) {
                    setEmployeesToAssign([...employeesToAssign, e.target.value]);
                }
            }
        }

        setTask({
            ...task,
            name: e.target.name === "taskName" ? e.target.value : task.name,
            description: e.target.name === "taskDescription" ? e.target.value : task.description,
            status: "Requested",
            startTime: task.startTime === undefined ? moment().format('yyy-MM-DD') : task.startTime,
            deadline: task.deadline === undefined ? moment().format('yyyy-MM-DD') : task.deadline,
        })

    }

    const hendlePermissionDelete = chipToDelete => {
        setEmployeesToAssign(chips => chips.filter(chip => chip.name !== chipToDelete.name));
    }

    const hendlePostTask = () => {
        if (employeesToAssign.length === 0) {
            PostTask(task);
            return;
        }
        PostTasks(task);
    }

    return (
        <div className={classes.mainConteiner}>
            <div boxshadow={2} className={classes.title}>
                <h3 >Create New Task</h3>
            </div>
            <form className={classes.root} noValidate autoComplete="off">
                <div className={classes.formGrid}>
                    <DarkTextField
                        label=" Task Name"
                        name="taskName"
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Description"
                        maxRows={5}
                        name="taskDescription"
                        onChange={headleFormChange}
                    />
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            className={classes.datePicker}
                            disableToolbar
                            name="dateStart"
                            variant="inline"
                            format="yyyy-MM-DD"
                            margin="normal"
                            id="date-picker-inline"
                            label="Start Time"
                            value={task.startTime}
                            onChange={(date) => {
                                setTask({ ...task, startTime: date.format('yyyy-MM-DD') })
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            className={classes.datePicker}
                            disableToolbar
                            name="dateDeadline"
                            variant="inline"
                            format="yyyy-MM-DD"
                            margin="normal"
                            id="date-picker-inline"
                            label="Deadline"
                            value={task.Deadline}
                            onChange={(date) => {
                                setTask({ ...task, deadline: date.format('yyyy-MM-DD') })
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <DarkChipList
                    label="Employees"
                    name="employeeSelect"
                    collection={allEmployees}
                    clipListCollection={employeesToAssign}
                    onChange={headleFormChange}
                    onDelete={hendlePermissionDelete}
                />
                <Button
                    className={classes.createButton}
                    variant="contained"
                    color="primary"
                    onClick={hendlePostTask}
                >Create</Button>
            </form>
        </div>
    );
}
export default CreateTask;