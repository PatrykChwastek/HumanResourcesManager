import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, ConfirmDialog } from '../GlobalComponents';
import APIURL from '../../Services/Globals';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
    mainConteiner: {
        display: 'flex',
    },
    listComponent: {
        margin: '8px',
        width: '100%',
        minHeight: '610px',
        maxHeight: '610px',
        paddingTop: 0,
        backgroundColor: theme.palette.background.paper,
        color: 'white',
        boxShadow: theme.shadows[2],
        borderRadius: '4px',
        display: "flex",
        flexDirection: 'column',
        "& span": {
            display: "flex",
            alignItems: "center",
            marginRight: '4px'
        }
    },
    title: {
        color: theme.palette.text.primary,
        padding: '6px 0',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        borderRadius: '3px 3px 0 0',
        width: '100%',
    },
    inputBox: {
        display: 'flex',
        alignItems: 'center',
        width: '98%',
        paddingRight: '8px',
        "& .MuiFormControl-root": { width: '100%' }
    }
}));

const HR_Manager = () => {
    const classes = useStyles();
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newItem, setNewItem] = useState({ type: "", text: "" });
    const [toEdit, setToEdit] = useState({ id: 0, text: '', element: '' });
    const [delDialogProps, setDelDialogProps] = useState({
        open: false,
        id: 0,
        item: { name: '' },
        itemType: '',
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
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
    };

    const hendleCreate = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 0, name: newItem.text })
        };

        if (newItem.type === 'department') {
            fetch(APIURL + `departments`, requestOptions).then(data => {
                getData()
            });
            return;
        }
        fetch(APIURL + `positions`, requestOptions).then(data => {
            getData()
        });
    };

    const hendleEdit = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: toEdit.id, name: toEdit.text })
        };

        if (toEdit.element === "department") {
            fetch(APIURL +
                `departments/${toEdit.id}`,
                requestOptions
            ).then(data => {
                setToEdit({ ...toEdit, id: 0 })
                getData()
            });
            return;
        }
        fetch(APIURL +
            `positions/${toEdit.id}`,
            requestOptions
        ).then(data => {
            setToEdit({ ...toEdit, id: 0 })
            getData()
        });
    };

    const hendleDelete = async () => {
        const requestOptions = {
            method: 'Delete',
            headers: { 'Content-Type': 'application/json' }
        };

        if (delDialogProps.itemType === 'Department') {
            await fetch(APIURL +
                `departments/${delDialogProps.item.id}`,
                requestOptions
            ).then(data => getData());
            return;
        }
        await fetch(APIURL +
            `positions/${delDialogProps.item.id}`,
            requestOptions
        ).then(data => getData());
    };

    const delDialogOpen = () => {
        setDelDialogProps({ ...delDialogProps, open: !delDialogProps.open })
    }

    const listSkeleton = () => {
        return (
            <React.Fragment>
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
            </React.Fragment>
        );
    }

    return (
        <div className={classes.mainConteiner}>
            <ConfirmDialog
                title={delDialogProps.item.name + " " + delDialogProps.itemType}
                open={delDialogProps.open}
                setOpen={delDialogOpen}
                onConfirm={hendleDelete}
            >
                {'Are you sure you want to delete ' + delDialogProps.itemType.toLowerCase() + '?'}
            </ConfirmDialog>
            <List component="nav" className={classes.listComponent}>
                <div className={classes.title}>
                    <Typography variant="h6" style={{ marginLeft: '16px' }}>
                        Departments:
                    </Typography>

                </div>
                <div className={classes.inputBox}>
                    <DarkTextField
                        label="New Department"
                        onChange={(e) => setNewItem({ ...newItem, type: "department", text: e.target.value })}
                    />
                    <Button
                        style={{ marginLeft: '15px' }}
                        variant="contained"
                        color="primary"
                        onClick={hendleCreate}
                    >Create</Button>
                </div>
                <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                {departments.length <= 0 ? listSkeleton() :
                    <div style={{ overflow: 'auto', }}>
                        {departments.map((item, index) => (
                            <div key={"position" + item.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    color="textPrimary"
                                                >
                                                    {'ID: '}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    color="textSecondary"
                                                >
                                                    {item.id}
                                                </Typography>

                                                <Typography style={{ marginLeft: '18px' }}
                                                    component="span"
                                                    variant="body1"
                                                    color="textPrimary"
                                                >
                                                    {'Name: '}
                                                </Typography>
                                                {toEdit.id === item.id ?
                                                    <div className={classes.inputBox}>
                                                        <DarkTextField
                                                            label="Department Name"
                                                            name="positionTF"
                                                            defaultValue={item.name}
                                                            onChange={(e) => setToEdit({
                                                                ...toEdit,
                                                                text: e.target.value,
                                                                element: 'department'
                                                            })}
                                                        />
                                                        <Button
                                                            style={{ marginLeft: '4px' }}
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={hendleEdit}
                                                        >edit</Button>
                                                    </div> :
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        color="textSecondary"
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                }
                                            </React.Fragment>}
                                    />
                                    <ListItemSecondaryAction>
                                        {toEdit.id === item.id ? null :
                                            <IconButton edge="end" onClick={() => setToEdit({ ...toEdit, id: item.id })}>
                                                <EditIcon />
                                            </IconButton>
                                        }
                                        <IconButton edge="end" onClick={() => setDelDialogProps({
                                            itemType: 'Department',
                                            item: item,
                                            open: true
                                        })}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                            </div>
                        ))}
                    </div>
                }
            </List>
            <List component="nav" className={classes.listComponent}>
                <div className={classes.title}>
                    <Typography variant="h6" style={{ marginLeft: '16px' }}>
                        Positions:
                    </Typography>

                </div>
                <div className={classes.inputBox}>
                    <DarkTextField
                        label="New Position"
                        onChange={(e) => setNewItem({ ...newItem, type: "position", text: e.target.value })}
                    />
                    <Button
                        style={{ marginLeft: '15px' }}
                        variant="contained"
                        color="primary"
                        onClick={hendleCreate}
                    >Create</Button>
                </div>
                <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                {positions.length <= 0 ? listSkeleton() :
                    <div style={{ overflow: 'auto', }}>
                        {positions.map((item, index) => (
                            <div key={"position" + item.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    color="textPrimary"
                                                >
                                                    {'ID: '}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    color="textSecondary"
                                                >
                                                    {item.id}
                                                </Typography>

                                                <Typography style={{ marginLeft: '18px' }}
                                                    component="span"
                                                    variant="body1"
                                                    color="textPrimary"
                                                >
                                                    {'Name: '}
                                                </Typography>
                                                {toEdit.id === item.id ?
                                                    <div className={classes.inputBox}>
                                                        <DarkTextField
                                                            label="Position Name"
                                                            defaultValue={item.name}
                                                            onChange={(e) => setToEdit({
                                                                ...toEdit,
                                                                text: e.target.value,
                                                                element: 'position'
                                                            })}
                                                        />
                                                        <Button
                                                            style={{ marginLeft: '4px' }}
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={hendleEdit}
                                                        >edit</Button>
                                                    </div> :
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        color="textSecondary"
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                }
                                            </React.Fragment>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        {toEdit.id === item.id ? null :
                                            <IconButton edge="end" onClick={() => setToEdit({ ...toEdit, id: item.id })}>
                                                <EditIcon />
                                            </IconButton>
                                        }
                                        <IconButton edge="end" onClick={() => setDelDialogProps({
                                            itemType: 'Position',
                                            item: item,
                                            open: true
                                        })}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                            </div>
                        ))}
                    </div>
                }
            </List>
        </div>
    )
};
export default HR_Manager;