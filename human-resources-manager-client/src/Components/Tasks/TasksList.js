import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals';
import { getCurrentUser } from '../../Services/AuthService';
import moment from "moment";
import { makeStyles } from '@material-ui/core/styles';
import { getTasks, changeTaskStatus } from "../../Services/TasksService";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Accordion, AccordionSummary, AccordionDetails, Chip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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

const useStyles = makeStyles((theme) => ({
    tasksContainer: {
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
    },
    listComponent: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        color: 'white',
        boxShadow: theme.shadows[2],
        borderRadius: '3px'
    },
    tasksDetailsCol: {
        margin: "8px",
        display: "flex",
        flexDirection: "column",
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '8px',
        marginBottom: '2px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        width: '100%',
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

const taskStatusAll = ['Completed', 'Requested', 'In-Progress'];
const allowedStatuses = taskStatusAll;
const TasksList = () => {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [expandedSubTask, setExpandedSubTask] = useState('');
    const [openStatusSel, setOpenStatusSel] = useState(false);
    const [statusSelIndex, setStatusSelIndex] = React.useState(1);
    const anchorRef = React.useRef(null);

    useEffect(() => {
        loadTasksList()
    }, []);

    const loadTasksList = () => {
        getTasks(1, 10, 12).then((data) => {
            setTasks(data.items)
        })
    }

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleSubTaskExpand = (taskId) => (event, newExpanded) => {
        setExpandedSubTask(newExpanded ? taskId : false);
    }

    const hendleChangeStatus = () => {
        changeTaskStatus(tasks[selectedIndex].id, allowedStatuses[statusSelIndex])
            .then((d) => { loadTasksList() },
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
            color: status === "In-Progress" ? "white" : "black",
            background: status === "In-Progress"
                ? "rgb(56 81 216)"
                : status === "Requested"
                    ? "rgb(231 170 35)"
                    : "rgb(0 158 7)",
        }
    }
    return (
        <div >
            {tasks.length === 0 ? null :
                <div className={classes.tasksContainer}>
                    <List component="nav" className={classes.listComponent}>
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
                                    color: tasks[selectedIndex].status === "In-Progress" ? "white" : "black",
                                    background: tasks[selectedIndex].status === "In-Progress"
                                        ? "rgb(56 81 216)"
                                        : tasks[selectedIndex].status === "Requested"
                                            ? "rgb(231 170 35)"
                                            : "rgb(0 158 7)",
                                }}
                            />
                        </div>
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

                        </CardContent>
                        <div className={classes.buttonSection}>
                            <Divider variant="inset" style={{ width: "100%", margin: "12px", marginLeft: "0" }} />
                            <ButtonGroup variant="contained" color="primary" ref={anchorRef}>
                                <Button onClick={hendleChangeStatus}>{allowedStatuses[statusSelIndex]}</Button>
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
                                                            key={option}
                                                            //  disabled={index === 2}
                                                            selected={index === statusSelIndex}
                                                            onClick={(event) => handleMenuItemClick(event, index)}
                                                        >
                                                            {option}
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