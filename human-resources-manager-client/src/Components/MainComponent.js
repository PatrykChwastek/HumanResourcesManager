import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import EmployeeList from './Employees/EmployeeList';
import HR_Dashboard from './Employees/HR_Dashboard';
import CreateJobApplication from './JobApplication/CreateJobApplication';
import CreateEmployee from './Employees/CreateEmployee';
import { EmployeeDetails } from './Employees/EmployeeDetails';
import LoginUser from './Users/LoginUser';
import TeamManager from './Teams/TeamManager';
import TasksColumns from './Tasks/TasksColumns';
import TasksList from "./Tasks/TasksList";
import { getUserAccess, logout } from '../Services/AuthService';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        background: theme.palette.grey[800],
        color: theme.palette.common.white,
    },
    drawerContainer: {
        overflow: 'auto',
        '& .MuiTypography-body1': {
            fontSize: '19px'
        },
        '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
            backgroundColor: "#3f51b5",
            color: 'white',
            marginRight: '12px',
            padding: '2px 6px',
            paddingRight: '0',
            borderRadius: '4px',
            boxShadow: theme.shadows[2],
        },
    },
    content: {
        flexGrow: 1,
        padding: '1.5rem',
        paddingTop: '5rem',
    },
    linkButtons: {
        textDecoration: "none",
        color: "white",
    },
}));

const MainComponent = () => {
    const [userAccess, setUserAccess] = useState(getUserAccess());
    const history = useHistory();
    useEffect(() => {

        console.log(userAccess);
    }, []);

    const handleLogout = () => {
        logout();
        history.push("/login");
    }
    const classes = useStyles();
    return (
        <Router>
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            Human Resources Manager
                        </Typography>
                        <Button onClick={handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <TreeView
                            defaultExpanded={['2']}
                            defaultSelected={['4']}
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                        >
                            {userAccess.humanResources === false ? null :
                                <Link className={classes.linkButtons} to="/main/dashboard">
                                    <TreeItem nodeId="1" label="Dashboard" />
                                </Link>
                            }
                            <TreeItem nodeId="2" label="My Tasks:">
                                <Link className={classes.linkButtons} to="/main/tasks-columns">
                                    <TreeItem nodeId="3" label="Columns" />
                                </Link>
                                <Link className={classes.linkButtons} to="/main/tasks-list" >
                                    <TreeItem nodeId="4" label="List" />
                                </Link>
                            </TreeItem>
                            {userAccess.humanResources === false ? null :
                                <React.Fragment>
                                    <Link className={classes.linkButtons} to="/main/employees">
                                        <TreeItem nodeId="5" label="Employees" />
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/create-employee">
                                        <TreeItem nodeId="6" label="Create Employee" />
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/applications">
                                        <TreeItem nodeId="7" label="Job Applications" />
                                    </Link>
                                </React.Fragment>
                            }
                        </TreeView>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Switch>
                        <Route path="/main/dashboard">
                            <HR_Dashboard />
                        </Route>
                        <Route path="/main/tasks-columns">
                            <TasksColumns />
                        </Route>
                        <Route path="/main/tasks-list">
                            <TasksList />
                        </Route>
                        <Route path="/main/create-employee">
                            <CreateEmployee />
                        </Route>
                        <Route path="/main/employees" >
                            <EmployeeList />
                        </Route>
                        <Route path="/main/employee-details/:id" >
                            <EmployeeDetails />
                        </Route>
                        <Route path="/main/team-manager">
                            <TeamManager />
                        </Route>
                    </Switch>
                </main>
            </div >
        </Router >
    );
}
export default MainComponent;