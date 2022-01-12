import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import APIURL from '../Services/Globals';
import { getCurrentUser } from '../Services/AuthService';



const UserTasks = () => {
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
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                            key={columnId}
                        >
                            <h2>{column.name}</h2>
                            <div style={{ margin: 8 }}>
                                <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => {
                                        return (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    background: snapshot.isDraggingOver
                                                        ? "lightblue"
                                                        : "lightgrey",
                                                    padding: 4,
                                                    width: 250,
                                                    minHeight: 500
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
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            userSelect: "none",
                                                                            padding: 16,
                                                                            margin: "0 0 8px 0",
                                                                            minHeight: "50px",
                                                                            backgroundColor: snapshot.isDragging
                                                                                ? "#263B4A"
                                                                                : "#456C86",
                                                                            color: "white",
                                                                            ...provided.draggableProps.style
                                                                        }}
                                                                    >
                                                                        {item.name}
                                                                        {item.status}
                                                                    </div>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        );
                                    }}
                                </Droppable>
                            </div>
                        </div>
                    );
                })}
            </DragDropContext>
        </div>
    );
}
export default UserTasks;