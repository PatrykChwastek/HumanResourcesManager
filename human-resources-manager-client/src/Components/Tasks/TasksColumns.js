import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getTasks, changeTaskStatus, getUserTasksStats } from '../../Services/TasksService';
import { getCurrentUser } from '../../Services/AuthService';
import { Link } from "react-router-dom";
import moment from "moment";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Accordion, AccordionSummary, AccordionDetails, Chip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
    taskTabContainer: {
        margin: '0 auto',
        width: 'max-content'
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row'
    },
    filterBox: {
        padding: ".1rem",
        paddingLeft: "1.8rem",
        paddingRight: "1.8rem",
        borderRadius: '4px',
        marginLeft: '8px',
        width: "max-content",
        background: theme.palette.grey[800],
        boxShadow:
            "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    },
    delayedDisplay: {
        width: "max-content",
        padding: "0 8px 0",
        marginLeft: '8px',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.grey[800],
        "& a": {
            color: "white",
            textDecoration: "none",
        }

    },
    whiteText: {
        color: "white",
        marginLeft: "0px",
        marginRight: "8px",
    },
    column: {
        margin: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
        fontSize: "11px",
        fontWeight: "550"
    },
}));

const filter = {
    name: "",
    status: "Delayed",
    isBStartTime: false,
    bStartTime: undefined,
    isAStartTime: false,
    aStartTime: undefined,
    isBDeadline: false,
    bDeadline: undefined,
    isADeadline: false,
    aDeadline: undefined
};

const userID = getCurrentUser().userDetails.employeeDTO.id;
const TasksColumns = () => {
    const classes = useStyles();
    const [expandedTask, setExpandedTask] = useState('');
    const [expandedSubTask, setExpandedSubTask] = useState('');
    const [userTaskStats, setUserTaskStats] = useState({});
    const [taskFilter, setTaskFilter] = useState({
        filterMode: "Today",
        beforeStartTime: moment().format("YYYY-MM-DD"),
        afterStartTime: moment().format("YYYY-MM-DD"),
    });
    const [columns, setColumns] = useState({

        ['requested']: {
            columnId: "requested",
            name: "Requested",
            statusName: "Requested",
            items: []
        },
        ['inprogress']: {
            columnId: "inprogress",
            name: "In Progress",
            statusName: "In-Progress",
            items: []
        },
        ['completed']: {
            columnId: "completed",
            name: "Completed",
            statusName: "Completed",
            items: []
        }
    });


    useEffect(() => {
        getUserTasksStats(userID).then((data) => {
            setUserTaskStats(data)
        });
    }, []);

    useEffect(() => {
        let completed = [];
        let requested = [];
        let progress = [];
        getTasks(1, 50, userID,
            '', undefined,
            taskFilter.beforeStartTime,
            taskFilter.afterStartTime)
            .then((data) => {
                data.items.forEach(item => {
                    switch (item.status) {
                        case "Requested":
                            requested.push(item)
                            break;
                        case "Completed":
                            completed.push(item)
                            break;
                        case "In-Progress":
                            progress.push(item)
                            break;
                    }
                });
                adddItemsToColumn(completed, requested, progress);
            });;
    }, [taskFilter]);

    const adddItemsToColumn = (com, req, prog) => {
        const completedCol = columns.completed;
        const requestedCol = columns.requested;
        const progressCol = columns.inprogress;
        setColumns({
            ...columns, [completedCol.columnId]: {
                ...completedCol,
                items: com
            }, [requestedCol.columnId]: {
                ...requestedCol,
                items: req
            }, [progressCol.columnId]: {
                ...progressCol,
                items: prog
            },
        })
    }

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const newStatus = columns[destination.droppableId].statusName;
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];

            const [changed] = sourceItems.splice(source.index, 1);
            changed.status = newStatus;
            destItems.splice(destItems.length, 0, changed);
            //destItems.splice(destination.index, 0, removed);

            changeTaskStatus(changed.id, changed.status).then(() => { });

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        }
    };

    const handleTaskExpand = (taskId) => (event, newExpanded) => {
        setExpandedTask(newExpanded ? taskId : false);
    }
    const handleSubTaskExpand = (taskId) => (event, newExpanded) => {
        setExpandedSubTask(newExpanded ? taskId : false);
    }
    const handleFilterChange = (mode) => {
        const today = moment();
        switch (mode) {
            case 'today':
                setTaskFilter({
                    filterMode: 'Today',
                    beforeStartTime: today.format("YYYY-MM-DD"),
                    afterStartTime: today.format("YYYY-MM-DD"),
                });
                break;
            case 'week':
                setTaskFilter({
                    filterMode: 'This Week',
                    beforeStartTime: today.endOf('isoWeek').format("YYYY-MM-DD"),
                    afterStartTime: today.startOf('isoWeek').format("YYYY-MM-DD")

                });
                break;
            case 'month':
                setTaskFilter({
                    filterMode: 'This Month',
                    beforeStartTime: today.endOf('month').format("YYYY-MM-DD"),
                    afterStartTime: today.startOf('month').format("YYYY-MM-DD")
                });
                break;
        }
    }

    return (
        <div className={classes.taskTabContainer}>
            <div className={classes.topBar}>
                <Toolbar className={classes.filterBox}>
                    <h3 className={classes.whiteText}>Tasks From: </h3>

                    <ButtonGroup variant="contained">
                        <Button
                            color={taskFilter.filterMode === 'Today' ? 'primary' : 'default'}
                            onClick={() => { handleFilterChange('today') }}
                        >
                            Today
                        </Button>
                        <Button
                            color={taskFilter.filterMode === 'This Week' ? 'primary' : 'default'}
                            onClick={() => { handleFilterChange('week') }}
                        >
                            This Week
                        </Button>
                        <Button
                            color={taskFilter.filterMode === 'This Month' ? 'primary' : 'default'}
                            onClick={() => { handleFilterChange('month') }}
                        >
                            This Month
                        </Button>
                    </ButtonGroup>
                </Toolbar>
                {userTaskStats.totalDelayedTasks === undefined ? null :
                    <Card className={classes.delayedDisplay}>
                        <Link to={
                            {
                                pathname: "/main/tasks-list",
                                filter: { filter }
                            }}>
                            <Typography noWrap variant="h6">
                                {'Delayed Tasks: ' + userTaskStats.totalDelayedTasks}
                            </Typography>
                        </Link>
                    </Card>
                }

            </div>
            <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                <DragDropContext
                    onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                >
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <Card className={classes.column}

                                key={columnId}
                            >
                                <div className={classes.title}>
                                    <Typography noWrap variant="h5">{column.name}</Typography>
                                </div>
                                <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => {
                                        return (
                                            <CardContent {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    background: snapshot.isDraggingOver
                                                        ? "rgb(128 128 128)"
                                                        : "#424242",
                                                    padding: "10px",
                                                    paddingBottom: "0",
                                                    width: "400px",
                                                    hight: "410px",
                                                    maxHeight: "410px",
                                                    minHeight: "410px",
                                                    overflowY: 'auto',
                                                    WebkitScrollbarButton: {
                                                        height: '100%'
                                                    }
                                                }}
                                            >
                                                {column.items.map((item, index) => {
                                                    return (
                                                        <Draggable
                                                            key={item.id}
                                                            draggableId={String(item.id)}
                                                            index={index}
                                                        >
                                                            {(provided) => {
                                                                return (
                                                                    <Accordion
                                                                        expanded={expandedTask === item.id}
                                                                        onChange={handleTaskExpand(item.id)}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            userSelect: "none",
                                                                            backgroundColor:
                                                                                item.status === "In-Progress"
                                                                                    ? "rgb(56 81 216)"
                                                                                    : item.status === "Requested"
                                                                                        ? "rgb(231 170 35)"
                                                                                        : "rgb(0 158 7)",
                                                                            color: item.status === "In-Progress" ? "white" : "black",
                                                                            borderRadius: '4px',
                                                                            marginBottom: '4px',
                                                                            ...provided.draggableProps.style
                                                                        }}
                                                                    >

                                                                        <AccordionSummary
                                                                            expandIcon={<ExpandMoreIcon style={{ color: "black" }} />}
                                                                            style={{ padding: '8px' }}
                                                                        >
                                                                            <Typography variant="subtitle1">{item.name}</Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails style={{
                                                                            display: "flex",

                                                                            alignContent: "flex-start",
                                                                            flexDirection: 'column',
                                                                            padding: '0px',
                                                                        }}>
                                                                            <div className={classes.chipContainer}>
                                                                                <Chip
                                                                                    className={classes.timeChip}
                                                                                    label={"Start: " + item.startTime.toString().split('T')[0]}
                                                                                    color="primary"
                                                                                />
                                                                                <Chip
                                                                                    className={classes.timeChip}
                                                                                    label={"Deadline: " + item.deadline.toString().split('T')[0]}
                                                                                    color="primary"
                                                                                />
                                                                            </div>
                                                                            <Typography
                                                                                variant="body1"
                                                                                style={{ marginLeft: '5px', marginBottom: '5px' }}
                                                                            >
                                                                                {item.description}
                                                                            </Typography>
                                                                            {item.subtasks.length === 0 ? null :
                                                                                <div style={{
                                                                                    paddingLeft: '8px',
                                                                                    paddingRight: '8px',
                                                                                    backgroundColor: "rgb(0 0 0 / 26%)"
                                                                                }}>
                                                                                    <Typography>
                                                                                        Subtasks:
                                                                                    </Typography>
                                                                                    {item.subtasks.map((subtask) => {
                                                                                        return (
                                                                                            <Accordion
                                                                                                expanded={expandedSubTask === subtask.id}
                                                                                                onChange={handleSubTaskExpand(subtask.id)}
                                                                                                key={subtask.id}
                                                                                                style={{
                                                                                                    backgroundColor:
                                                                                                        item.status === "In-Progress"
                                                                                                            ? "rgb(93 135 230)"
                                                                                                            : item.status === "Requested"
                                                                                                                ? "rgb(255 234 144)"
                                                                                                                : "rgb(3 189 0)",
                                                                                                    color: item.status === "In-Progress" ? "white" : "black",
                                                                                                    marginBottom: '4px',
                                                                                                    borderRadius: '4px',
                                                                                                    padding: '0px'

                                                                                                }}>
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
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            }
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </CardContent>
                                        );
                                    }}
                                </Droppable>
                            </Card>
                        );
                    })}
                </DragDropContext>
            </div >
        </div>
    );
}
export default TasksColumns;