import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect, DarkChipList } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import { getCurrentUser } from '../../Services/AuthService';
import { authHeader } from '../../Services/AuthService'

import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import moment from "moment";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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
        gridTemplateRows: "1fr 1fr 1fr",
        justifyContent: "space-between",
        alignContent: "space-between",
        gridGap: "0.7rem 0.7rem",
    },
    nameInput: {
        gridRowStart: '1',
        gridColumnStart: '1',
        gridRowEnd: '2',
        gridColumnEnd: '3',
        display: "grid",
    },
    descriptionInput: {
        gridRowStart: '2',
        gridColumnStart: '1',
        gridRowEnd: '3',
        gridColumnEnd: '3',
        display: "grid"
    },
    datePickerST: {
        marginTop: '0',
        marginLeft: "20px",
        gridRowStart: '3',
        gridColumnStart: '1',
        gridRowEnd: '4',
        gridColumnEnd: '2',
    },
    datePickerD: {
        marginTop: '0',
        marginRight: '8px',
        gridRowStart: '3',
        gridColumnStart: '2',
        gridRowEnd: '4',
        gridColumnEnd: '3',
    },
    addSubtaskButton: {
        width: '10rem',
    },
    subtasksContainer: {
        display: 'grid',
        gridRowStart: '4',
        gridColumnStart: '1',
        gridRowEnd: '5',
        gridColumnEnd: '3',
        padding: '20px',
        paddingTop: '0px'
    },
    createButton: {
        margin: '0 auto',
        display: 'block',
        width: "19rem",
    },
    subtaskAccordion: {
        backgroundColor: '#bdbdbd',
        color: "black",
        marginTop: "8px",
        marginBottom: '4px',
        borderRadius: '4px',
        padding: '0px',
        '&::before': {
            height: 0
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        color: "white",
        backgroundColor: "#424242",
        boxShadow: theme.shadows[2],
        padding: theme.spacing(2, 4, 3),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: "260px",
        minHeight: "280px",
    },
}));

const CreateTask = () => {
    const classes = useStyles();
    const leaderID = getCurrentUser().userDetails.employeeDTO.id;
    const [task, setTask] = useState({})
    const [subtasks, setSubtasks] = useState([])
    const [newSubtask, setNewSubtask] = useState({})
    const [expandedSubTask, setExpandedSubTask] = useState('');
    const [allEmployees, setAllEmployees] = useState([])
    const [employeesToAssign, setEmployeesToAssign] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false
    });


    useEffect(() => {
        getMembers();
    }, []);

    useEffect(() => {
        setTask({
            ...task,
            subtasks: subtasks
        })
    }, [subtasks]);


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
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
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
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
            body: JSON.stringify(formData),
        };
        fetch(APIURL + 'tasks', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data),
                setAllertProps({
                    text: "Task Created",
                    open: true
                })
            );
    }

    const PostTasks = (formData) => {
        let employeesId = [];
        employeesToAssign.map(employee => {
            employeesId.push(employee.id);
        })
        const requestOptions = {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
            body: JSON.stringify({
                employeeTaskDTO: formData,
                employeesID: employeesId
            }),
        };
        fetch(APIURL + 'tasks/multi', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data),
                setAllertProps({
                    text: "Tasks Created",
                    open: true
                }));
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
    const headleModalFormChange = e => {
        setNewSubtask({
            ...newSubtask,
            ...task,
            name: e.target.name === "subtaskName" ? e.target.value : newSubtask.name,
            description: e.target.name === "subtaskDescription" ? e.target.value : newSubtask.description,
            status: "Requested",
            startTime: task.startTime === undefined ? moment().format('yyy-MM-DD') : task.startTime,
            deadline: task.deadline === undefined ? moment().format('yyyy-MM-DD') : task.deadline,
        });
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

    const handleSubTaskExpand = (index) => (event, newExpanded) => {
        setExpandedSubTask(newExpanded ? index : false);
    }

    const handleModalOpen = () => {
        setModalIsOpen(true);
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    const handleModalConfirm = () => {
        setSubtasks(old => [
            ...old, newSubtask
        ])
        setModalIsOpen(false);
    };
    const subtaskModal = () => {
        return (
            <Modal
                aria-labelledby="modal-title"
                className={classes.modal}
                open={modalIsOpen}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalIsOpen}>
                    <div className={classes.modalContent}>
                        <h2 id="modal-title">Create New Subtask</h2>
                        <DarkTextField
                            label="Subtask Name"
                            name="subtaskName"
                            onChange={headleModalFormChange}
                        />
                        <DarkTextField
                            label="Description"
                            maxRows={5}
                            name="subtaskDescription"
                            onChange={headleModalFormChange}
                        />
                        <Button
                            style={{ margin: "10px", marginBottom: "0" }}
                            variant="contained"
                            color="primary"
                            onClick={handleModalConfirm}
                        >Create</Button>
                    </div>

                </Fade>
            </Modal>
        );
    }

    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    return (
        <div className={classes.mainConteiner}>
            {subtaskModal()}
            <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                <Alert onClose={handleAllertClose} severity="success">
                    {allertProps.text}
                </Alert>
            </Snackbar>
            <div boxshadow={2} className={classes.title}>
                <h3 >Create New Task</h3>
            </div>
            <form className={classes.root} noValidate autoComplete="off">
                <div className={classes.formGrid}>
                    <div className={classes.nameInput}>
                        <DarkTextField
                            label=" Task Name"
                            name="taskName"
                            onChange={headleFormChange}
                        />
                    </div>
                    <div className={classes.descriptionInput} >
                        <DarkTextField

                            label="Description"
                            maxRows={5}
                            name="taskDescription"
                            onChange={headleFormChange}
                        />
                    </div>

                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            className={classes.datePickerST}
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
                            className={classes.datePickerD}
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
                    <div className={classes.subtasksContainer}>
                        <Button
                            className={classes.addSubtaskButton}
                            variant="contained"
                            color="primary"
                            onClick={handleModalOpen}
                            endIcon={<AddCircleIcon />}
                        >Add Subtask</Button>
                        {subtasks.length < 1 ? null :
                            <div >
                                <Divider variant="inset" style={{ width: "100%", margin: "12px", marginLeft: "0" }} />
                                <Typography noWrap variant="subtitle1" style={{ color: "white" }}>
                                    Subtasks:
                                </Typography>
                                {subtasks.map((subtask, index) => (
                                    <Accordion
                                        expanded={expandedSubTask === index}
                                        onChange={handleSubTaskExpand(index)}
                                        key={"subt" + index}
                                        className={classes.subtaskAccordion}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon style={{ color: "black" }} />}
                                        >
                                            <Typography>
                                                {subtask.name}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {subtask.description}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}

                            </div>
                        }
                    </div>
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