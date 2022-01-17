import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals';
import { getCurrentUser } from '../../Services/AuthService';
import moment from "moment";
import { makeStyles } from '@material-ui/core/styles';
import { getTasks } from "../../Services/TasksService";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Accordion, AccordionSummary, AccordionDetails, Chip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

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
}));

const TasksList = () => {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tasks, setTasks] = useState([]);


    useEffect(() => {
        getTasks(1, 10, 12).then((data) => {
            setTasks(data.items)
        })
    }, []);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <div >
            {tasks.length === 0 ? null :
                <div className={classes.tasksContainer}>
                    <List component="nav" className={classes.listComponent}>
                        {tasks.map((task, index) => (
                            <div>
                                <ListItem
                                    key={task.id}
                                    button
                                    selected={selectedIndex === index}
                                    onClick={(event) => handleListItemClick(event, index)}
                                >
                                    <ListItemText primary={task.name} />
                                    <Chip
                                        label={task.status}
                                        style={{
                                            boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 1px -2px, rgb(0 0 0 / 14%) 0px 1px 2px 0px, rgb(0 0 0 / 12%) 0px 0px 5px 0px',
                                            fontSize: "12px",
                                            fontWeight: "550",
                                            padding: "5px",
                                            minWidth: '92px',
                                            color: task.status === "In-Progress" ? "white" : "black",
                                            background: task.status === "In-Progress"
                                                ? "rgb(56 81 216)"
                                                : task.status === "Requested"
                                                    ? "rgb(231 170 35)"
                                                    : "rgb(0 158 7)",
                                        }}
                                    />

                                </ListItem>
                                <Divider variant="inset" style={{ width: "100%", margin: "0" }} /></div>
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
                        <CardContent>
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
                        </CardContent>

                    </Card>
                </div>
            }
        </div>
    );
}
export default TasksList;