import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import APIURL from '../Services/Globals';
import { getCurrentUser } from '../Services/AuthService';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Accordion, AccordionSummary, AccordionDetails, Chip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
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
        width: '-webkit-fill-available',
    },
    timeChip: {
        margin: "2px",
        boxShadow: theme.shadows[2],
        fontSize: "11px",
        fontWeight: "550"

    }
}));

const UserTasks = () => {
    const classes = useStyles();
    const [columns, setColumns] = useState({
        ['completed']: {
            columnId: "completed",
            name: "Completed",
            statusName: "Completed",
            items: []
        },
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
        }
    });

    useEffect(() => {
        const userID = getCurrentUser().userDetails.employeeDTO.id;
        let completed = [];
        let requested = [];
        let progress = [];
        getTasks(1, 10, userID,).then((data) => {
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
    }, []);

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

    const getTasks = async (page, size, employeeid, status) => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        return await fetch(APIURL +
            `tasks?page=${page}&size=${size}&employeeid=${employeeid}`,
            requestOptions
        ).then((response) => {
            if (response.ok)
                return response.json();
            else
                return Promise.reject();
        })
            .then(data => {
                return data
            })
    }

    const changeTaskStatus = async (taskID, status) => {
        const requestOptions = {
            method: 'Put',
            headers: { 'Content-Type': 'application/json' }
        };
        return await fetch(APIURL +
            `tasks?id=${taskID}&status=${status}`,
            requestOptions
        ).then((response) => {
            if (response.ok)
                return response.json();
            else
                return Promise.reject();
        })
            .then(data => {
                return data
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

            changeTaskStatus(changed.id, changed.status).then();

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

    return (
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
                                                minWidth: "300px",
                                                minHeight: "300px"
                                            }}
                                        >
                                            {column.items.map((item, index) => {
                                                return (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={String(item.id)}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <Accordion ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        userSelect: "none",
                                                                        backgroundColor:
                                                                            item.status === "In-Progress"
                                                                                ? "rgb(93 135 230)"
                                                                                : item.status === "Requested"
                                                                                    ? "rgb(255 188 0)"
                                                                                    : "rgb(3 189 0)",
                                                                        color: "black",
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
                                                                        <div style={{
                                                                            display: "flex",
                                                                            flexDirection: "row",
                                                                            alignContent: 'space-around',
                                                                            alignItems: 'stretch',
                                                                            flexwrap: 'nowrap',
                                                                            justifyContent: 'space-evenly'
                                                                        }}>
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
                                                                                            key={subtask.id}
                                                                                            style={{
                                                                                                backgroundColor:
                                                                                                    item.status === "In-Progress"
                                                                                                        ? "rgb(93 135 230)"
                                                                                                        : item.status === "Requested"
                                                                                                            ? "rgb(255 234 144)"
                                                                                                            : "rgb(3 189 0)",
                                                                                                color: "black",
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
    );
}
export default UserTasks;