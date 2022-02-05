import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals';
import { Link } from "react-router-dom";
import { getCurrentUser } from '../../Services/AuthService';
import moment from "moment";
import { makeStyles } from '@material-ui/core/styles';
import { getTasks, changeTaskStatus, getTeamTasks } from "../../Services/TasksService";
import { DarkTextField, DarkSelect } from '../GlobalComponents';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Accordion, AccordionSummary, AccordionDetails, Chip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Pagination from '@material-ui/lab/Pagination';
import Toolbar from '@material-ui/core/Toolbar';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    filterBox: {
        padding: ".1rem",
        paddingLeft: "1.1rem",
        paddingRight: "1.1rem",
        borderRadius: '4px',
        marginLeft: '8px',
        width: "max-content",
        background: theme.palette.grey[800],
        boxShadow:
            "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
        "& .MuiAccordion-root": {
            margin: "0px",
            color: "black",
            backgroundColor: '#bdbdbd',
            borderRadius: "4px",
            width: '243px',
            boxShadow:
                "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
            '&:before': {
                display: 'none',
            },
        },
        "& .MuiAccordionSummary-root": {
            minHeight: "36px",
            maxHeight: "36px"
        },
        "& .MuiCollapse-root": {
            position: "absolute",
            top: "30px",
            paddingTop: "20px",
            backgroundColor: '#bdbdbd',
            zIndex: '1',
            borderRadius: "4px",
            boxShadow:
                "-1px 2px 1px 0px rgb(0 0 0 / 20%), -2px 3px 3px 0px rgb(0 0 0 / 35%), 1px 2px 1px 1px rgb(0 0 0 / 30%)",
        },
        "& .MuiAccordionDetails-root": {
            flexWrap: 'wrap'
        }
    },
    filterDate: {
        padding: '0 6px',
        margin: '3px',
        display: 'flex',
        width: '190px'
    },
    whiteText: {
        color: "white",
        margin: "0px",
        marginRight: "8px",
    },
    tasksContainer: {
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    listComponent: {
        margin: '8px',
        width: '100%',
        paddingTop: 0,
        backgroundColor: theme.palette.background.paper,
        color: 'white',
        boxShadow: theme.shadows[2],
        borderRadius: '4px',
        display: "flex",
        flexDirection: 'column',
    },
    pagination: {
        display: 'grid',
        padding: '8px',
        marginTop: 'auto',
        "& .Mui-selected": {
            color: 'white',
            backgroundColor: 'rgb(63 81 181 / 80%)',
        },
        "& .MuiPaginationItem-outlined": {
            boxShadow: theme.shadows[2],
            border: '1px solid rgb(149 149 149 / 23%)'
        }
    },
    tasksDetailsCol: {
        margin: "8px",
        width: '100%',
        display: "flex",
        flexDirection: "column",
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '6px 0',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        borderRadius: '3px 3px 0 0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    linkButton: {
        marginRight: '10px',
        marginLeft: 'auto',
        textDecoration: "none",
        color: "white",
    },
    statusContainer: {
        display: "flex",
        flexDirection: "row",
        margin: '4px',
        marginLeft: '15px',
    },
    chipContainer: {
        display: "flex",
        flexDirection: "row",
        alignContent: 'space-around',
        alignItems: 'stretch',
        flexwrap: 'nowrap',
        justifyContent: 'space-evenly'
    },
    timeChip: {
        margin: "2px",
        boxShadow: theme.shadows[2],
        fontSize: "12px",
        fontWeight: "550"

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
    buttonSection: {
        display: 'grid',
        padding: '16px',
        marginTop: 'auto',
        justifyItems: 'center',
        "& .MuiButton-label": {
            paddingLeft: '4px',
            paddingRight: '4px',
        }
    },
}));
const taskStatusAll = [{ id: 1, name: 'Completed' }, { id: 2, name: 'Requested' }, { id: 3, name: 'In-Progress' }];
const allowedStatuses = taskStatusAll;
const TasksList = ({ userId, teamId }) => {
    const classes = useStyles();
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selTaskEmployee, setSelTaskEmployee] = useState({});
    const [tasks, setTasks] = useState([]);
    const [expandedSubTask, setExpandedSubTask] = useState('');
    const [openStatusSel, setOpenStatusSel] = useState(false);
    const [statusSelIndex, setStatusSelIndex] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 1
    });
    const [filterParams, setFilterParams] = useState({
        name: "",
        status: undefined,
        isBStartTime: false,
        bStartTime: undefined,
        isAStartTime: false,
        aStartTime: undefined,
        isBDeadline: false,
        bDeadline: undefined,
        isADeadline: false,
        aDeadline: undefined
    });

    useEffect(() => {
        loadTasksList(
            pagination.page,
            pagination.size
        );
    }, []);

    useEffect(() => {
        if (teamId !== undefined && tasks[selectedIndex] !== undefined) {
            getAssignedEmployee(tasks[selectedIndex].assignedEmployeeId);
        }
    }, [selectedIndex, tasks]);

    const getAssignedEmployee = async (empID) => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        await fetch(APIURL + `employee/get/` + empID,
            requestOptions
        )
            .then(response => response.json())
            .then(data => setSelTaskEmployee(data));
    }

    const loadTasksList = (page, size) => {
        if (teamId === undefined && userId !== undefined) {
            getTasks(
                page, size, userId,
                filterParams.name,
                filterParams.status,
                filterParams.bStartTime,
                filterParams.aStartTime,
                filterParams.bDeadline,
                filterParams.aDeadline
            ).then((data) => {
                setPagination({
                    page: page,
                    size: size,
                    totalPages: data.totalPages - 1,
                })
                setTasks(data.items);
            })
        } else {
            getTeamTasks(
                page, size, teamId,
                filterParams.name,
                filterParams.status,
                filterParams.bStartTime,
                filterParams.aStartTime,
                filterParams.bDeadline,
                filterParams.aDeadline
            ).then((data) => {
                setPagination({
                    page: page,
                    size: size,
                    totalPages: data.totalPages - 1,
                })
                setTasks(data.items)
            })
        }
    }

    const handleChangeFilterParams = e => {
        if (e.target.name === 'statusSel') {
            setFilterParams({
                ...filterParams,
                status: e.target.value.name
            })
        }
        if (e.target.name === 'taskName') {
            setFilterParams({
                ...filterParams,
                name: e.target.value
            })
        }
        if (e.target.type === "checkbox") {
            const today = moment().format('yyy-MM-DD');
            switch (e.target.name) {
                case 'isBStartTime':
                    setFilterParams({
                        ...filterParams,
                        isBStartTime: e.target.checked,
                        bStartTime: e.target.checked === false ? undefined :
                            filterParams.bStartTime === undefined ? today :
                                filterParams.bStartTime
                    });
                    break;
                case 'isAStartTime':
                    setFilterParams({
                        ...filterParams,
                        isAStartTime: e.target.checked,
                        aStartTime: e.target.checked === false ? undefined :
                            filterParams.aStartTime === undefined ? today :
                                filterParams.aStartTime
                    });
                    break;
                case 'isBDeadline':
                    setFilterParams({
                        ...filterParams,
                        isBDeadline: e.target.checked,
                        bDeadline: e.target.checked === false ? undefined :
                            filterParams.bDeadline === undefined ? today :
                                filterParams.bDeadline
                    });
                    break;
                case 'isADeadline':
                    setFilterParams({
                        ...filterParams,
                        isADeadline: e.target.checked,
                        aDeadline: e.target.checked === false ? undefined :
                            filterParams.aDeadline === undefined ? today :
                                filterParams.aDeadline
                    });
                    break;
            }
        }

    }

    const handleApplyFilters = () => {
        console.log(filterParams);
        loadTasksList(pagination.page, pagination.size)
    }

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handlePageChange = (event, value) => {
        loadTasksList(value, pagination.size);
    };
    const handleSubTaskExpand = (taskId) => (event, newExpanded) => {
        setExpandedSubTask(newExpanded ? taskId : false);
    }

    const hendleChangeStatus = () => {
        changeTaskStatus(tasks[selectedIndex].id, allowedStatuses[statusSelIndex].name)
            .then((d) => { loadTasksList(pagination.page, pagination.size) },
                e => { console.log("status change error") });
    }

    const handleMenuItemClick = (event, index) => {
        setStatusSelIndex(index);
        setOpenStatusSel(false);
    };

    const handleStatSellToggle = () => {
        setOpenStatusSel((prevOpen) => !prevOpen);
    };

    const handleStatSellClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpenStatusSel(false);
    };

    const changeCipColor = (status) => {
        return {
            boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 1px -2px, rgb(0 0 0 / 14%) 0px 1px 2px 0px, rgb(0 0 0 / 12%) 0px 0px 5px 0px',
            fontSize: "12px",
            fontWeight: "550",
            padding: "5px",
            minWidth: '92px',
            color: status === "In-Progress" || status === "Delayed" ? "white" : "black",
            background: status === "In-Progress"
                ? "rgb(56 81 216)"
                : status === "Requested"
                    ? "rgb(231 170 35)" :
                    status === "Delayed" ?
                        "#bd0000" :
                        "rgb(0 158 7)",
        }
    }
    return (
        <div >
            <Toolbar className={classes.filterBox}>
                <h3 className={classes.whiteText}>Tasks From: </h3>
                <DarkTextField
                    onChange={handleChangeFilterParams}
                    label='Task Name...'
                    name='taskName'
                />
                <DarkSelect
                    label="Status"
                    name="statusSel"
                    collection={allowedStatuses}
                    firstVal={{ id: 0, name: 'All' }}
                    onChange={handleChangeFilterParams}
                />
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon style={{ color: "black" }} />}
                    >
                        <Typography>
                            Select Task by Date
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Card className={classes.filterDate}>
                            <Checkbox
                                color="secondary"
                                name="isBStartTime"
                                checked={filterParams.isBStartTime}
                                onChange={handleChangeFilterParams}
                            />
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    name="bStartTime"
                                    variant="inline"
                                    format="yyyy-MM-DD"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Before Start Time:"
                                    value={filterParams.bStartTime}
                                    onChange={(date) => {
                                        setFilterParams({
                                            ...filterParams,
                                            isBStartTime: true,
                                            bStartTime: date.format('yyyy-MM-DD'),
                                        })
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Card>
                        <Card className={classes.filterDate}>
                            <Checkbox
                                color="secondary"
                                name="isAStartTime"
                                checked={filterParams.isAStartTime}
                                onChange={handleChangeFilterParams}
                            />
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    name="datePicker"
                                    variant="inline"
                                    format="yyyy-MM-DD"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="After Start Time:"
                                    value={filterParams.aStartTime}
                                    onChange={(date) => {
                                        setFilterParams({
                                            ...filterParams,
                                            isAStartTime: true,
                                            aStartTime: date.format('yyyy-MM-DD'),
                                        })
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Card>
                        <Card className={classes.filterDate}>
                            <Checkbox
                                color="secondary"
                                name="isBDeadline"
                                checked={filterParams.isBDeadline}
                                onChange={handleChangeFilterParams}
                            />
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    name="datePicker"
                                    variant="inline"
                                    format="yyyy-MM-DD"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Before Deadline:"
                                    value={filterParams.bDeadline}
                                    onChange={(date) => {
                                        setFilterParams({
                                            ...filterParams,
                                            isBDeadline: true,
                                            bDeadline: date.format('yyyy-MM-DD'),
                                        })
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Card>
                        <Card className={classes.filterDate}>
                            <Checkbox
                                color="secondary"
                                name="isADeadline"
                                checked={filterParams.isADeadline}
                                onChange={handleChangeFilterParams}
                            />
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    name="datePicker"
                                    variant="inline"
                                    format="yyyy-MM-DD"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="After Deadline:"
                                    value={filterParams.aDeadline}
                                    onChange={(date) => {
                                        setFilterParams({
                                            ...filterParams,
                                            isADeadline: true,
                                            aDeadline: date.format('yyyy-MM-DD'),
                                        })
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Card>
                    </AccordionDetails>
                </Accordion>
                <Button
                    style={{ marginLeft: '15px' }}
                    variant="contained"
                    color="primary"
                    onClick={handleApplyFilters}
                >Submit</Button>
            </Toolbar>
            {tasks.length === 0 ? null :
                <div className={classes.tasksContainer}>
                    <List component="nav" className={classes.listComponent}>
                        <div className={classes.title}>
                            <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                List of Tasks:
                            </Typography>
                            {teamId === undefined ? null :
                                <Link className={classes.linkButton} to="/main/create-task">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        endIcon={<AddCircleIcon />}
                                    >NEW Task</Button>
                                </Link>
                            }
                        </div>
                        {tasks.map((task, index) => (
                            <div key={task.id}>
                                <ListItem

                                    button
                                    selected={selectedIndex === index}
                                    onClick={(event) => handleListItemClick(event, index)}
                                >
                                    <ListItemText primary={task.name} />
                                    <Chip
                                        label={task.status}
                                        style={changeCipColor(task.status)}
                                    />

                                </ListItem>
                                <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                            </div>
                        ))
                        }
                        <Pagination
                            className={classes.pagination}
                            count={pagination.totalPages}
                            page={pagination.page}
                            onChange={handlePageChange}
                            variant="outlined"
                        />
                    </List>
                    <Card className={classes.tasksDetailsCol}>
                        <div className={classes.title}>
                            <Typography noWrap variant="h5">
                                {tasks[selectedIndex].name}
                            </Typography>
                        </div>
                        <div className={classes.statusContainer}>
                            <Typography variant="h6">
                                Status:
                            </Typography>
                            <Chip
                                label={tasks[selectedIndex].status}
                                style={{
                                    boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
                                    fontSize: "14px",
                                    fontWeight: "550",
                                    margin: "2px",
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                    width: "99%",
                                    color: tasks[selectedIndex].status === "In-Progress" ||
                                        tasks[selectedIndex].status === "Delayed" ? "white" : "black",
                                    background: tasks[selectedIndex].status === "In-Progress"
                                        ? "rgb(56 81 216)"
                                        : tasks[selectedIndex].status === "Requested"
                                            ? "rgb(231 170 35): " :
                                            tasks[selectedIndex].status === "Delayed" ?
                                                "#bd0000" :
                                                "rgb(0 158 7)",
                                }}
                            />

                        </div>
                        {selTaskEmployee.id === undefined ? null :
                            <div className={classes.statusContainer}>
                                <Typography noWrap variant="h6">
                                    {"Assigned Employee: " +
                                        selTaskEmployee.person.name + " " +
                                        selTaskEmployee.person.surname
                                    }
                                </Typography>
                            </div>

                        }
                        <CardContent style={{ paddingTop: 0 }}>
                            <Divider variant="inset" style={{ width: "100%", margin: "12px", marginLeft: "0", marginTop: '2px' }} />
                            <div className={classes.chipContainer}>
                                <Chip
                                    className={classes.timeChip}
                                    label={"Start: " + moment(tasks[selectedIndex].startTime).format("YYYY-MM-DD")}
                                    color="primary"
                                />
                                <Chip
                                    className={classes.timeChip}
                                    label={"Deadline: " + moment(tasks[selectedIndex].deadline).format("YYYY-MM-DD")}
                                    color="primary"
                                />
                            </div>
                            <Divider variant="inset" style={{ width: "100%", margin: "12px", marginLeft: "0" }} />

                            <Typography variant="subtitle1">
                                {tasks[selectedIndex].description}
                            </Typography>
                            {tasks[selectedIndex].subtasks.length < 1 ? null :
                                <div>
                                    <Divider variant="inset" style={{ width: "100%", margin: "12px", marginLeft: "0" }} />
                                    <Typography noWrap variant="subtitle1">
                                        Subtasks:
                                    </Typography>
                                    {tasks[selectedIndex].subtasks.map((subtask, index) => (
                                        <Accordion
                                            expanded={expandedSubTask === subtask.id}
                                            onChange={handleSubTaskExpand(subtask.id)}
                                            key={subtask.id}
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


                        </CardContent>
                        <div className={classes.buttonSection}>
                            <Divider variant="inset" style={{ width: "100%", margin: "12px", marginLeft: "0" }} />
                            <ButtonGroup variant="contained" color="primary" ref={anchorRef}>
                                <Button onClick={hendleChangeStatus}>{allowedStatuses[statusSelIndex].name}</Button>
                                <Button
                                    color="primary"
                                    size="small"
                                    aria-controls={openStatusSel ? 'split-button-menu' : undefined}
                                    aria-expanded={openStatusSel ? 'true' : undefined}
                                    aria-label="select merge strategy"
                                    aria-haspopup="menu"
                                    onClick={handleStatSellToggle}
                                >
                                    <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>
                            <Popper open={openStatusSel} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleStatSellClose}>
                                                <MenuList id="split-button-menu">
                                                    {allowedStatuses.map((option, index) => (
                                                        <MenuItem
                                                            key={option.name}
                                                            //  disabled={index === 2}
                                                            selected={index === statusSelIndex}
                                                            onClick={(event) => handleMenuItemClick(event, index)}
                                                        >
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>

                        </div>
                    </Card>
                </div>
            }
        </div >
    );
}
export default TasksList;