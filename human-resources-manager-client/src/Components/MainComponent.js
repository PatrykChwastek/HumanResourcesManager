import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import EmployeeList from './Employees/EmployeeList';
import HR_Dashboard from './Employees/HR_Dashboard';
import HR_Manager from './Employees/HR_Manager';
import CreateJobApplication from './JobApplication/CreateJobApplication';
import EmployeeForm from './Employees/EmployeeForm';
import { EmployeeDetails } from './Employees/EmployeeDetails';
import Profile from './Users/Profile'
import UsersList from "./Users/UsersList";
import UserForm from './Users/UserForm';
import Team_Dashboard from './Teams/Team_Dashboard';
import TeamTasks from "./Teams/TeamTasks";
import TasksColumns from './Tasks/TasksColumns';
import TasksList from "./Tasks/TasksList";
import CreateTask from "./Tasks/CreateTask";
import TeamList from "./Teams/TeamList"
import CreateTeam from "./Teams/CreateTeam";
import AddTeamMembers from "./Teams/AddTeamMembers"
import { getUserAccess, logout, getCurrentUser } from '../Services/AuthService';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
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
    const [userAccess] = useState(getUserAccess());
    const history = useHistory();

    const currentLocation = () => {
        switch (history.location.pathname) {
            case '/main/dashboard':
                return ['1'];
            case '/main/tasks-columns':
                return ['3'];
            case '/main/tasks-list':
                return ['4'];
        }
    }
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
                        <Link className={classes.linkButtons} to="/main/profile">
                            <IconButton size='small' aria-label="delete">
                                <AccountCircleIcon />
                            </IconButton>
                        </Link>

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
                            defaultExpanded={['7']}
                            defaultSelected={currentLocation()}
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                        >
                            {userAccess.humanResources === false ? null :
                                <React.Fragment>
                                    <Link className={classes.linkButtons} to="/main/dashboard">
                                        <TreeItem nodeId="1" label="Dashboard" />
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/hr-manager">
                                        <TreeItem nodeId="2" label="HR-Manager" />
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/employees">
                                        <TreeItem nodeId="3" label="Employees" />
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/team-list">
                                        <TreeItem nodeId="4" label="Team List" />
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/applications">
                                        <TreeItem nodeId="5" label="Job Applications" />
                                    </Link>
                                </React.Fragment>
                            }
                            <TreeItem nodeId="6" label="My Tasks:">
                                <Link className={classes.linkButtons} to="/main/tasks-columns">
                                    <TreeItem nodeId="7" label="Columns" />
                                </Link>
                                <Link className={classes.linkButtons} to="/main/tasks-list" >
                                    <TreeItem nodeId="8" label="List" />
                                </Link>
                            </TreeItem>
                            <TreeItem nodeId="9" label="Team Manager">
                                <Link className={classes.linkButtons} to="/main/team-manager">
                                    <TreeItem nodeId="10" label="Team Dashboard" />
                                </Link>
                                <Link className={classes.linkButtons} to="/main/team-tasks">
                                    <TreeItem nodeId="11" label="Team Tasks" />
                                </Link>
                            </TreeItem >
                            <Link className={classes.linkButtons} to="/main/users-list" >
                                <TreeItem nodeId="12" label="Users List" />
                            </Link>
                        </TreeView>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Switch>
                        <Route path="/main/dashboard">
                            <HR_Dashboard />
                        </Route>
                        <Route path="/main/hr-manager">
                            <HR_Manager />
                        </Route>
                        <Route path="/main/tasks-columns">
                            <TasksColumns />
                        </Route>
                        <Route path="/main/tasks-list">
                            <TasksList userId={getCurrentUser().userDetails.employeeDTO.id} />
                        </Route>
                        <Route path="/main/employee-form">
                            <EmployeeForm />
                        </Route>
                        <Route path="/main/employees" >
                            <EmployeeList />
                        </Route>
                        <Route path="/main/employee-details/:id" >
                            <EmployeeDetails />
                        </Route>
                        <Route path="/main/team-list">
                            <TeamList />
                        </Route>
                        <Route path="/main/team-manager">
                            <Team_Dashboard />
                        </Route>
                        <Route path="/main/create-team">
                            <CreateTeam />
                        </Route>
                        <Route path="/main/add-team-members">
                            <AddTeamMembers />
                        </Route>
                        <Route path="/main/team-tasks">
                            <TeamTasks />
                        </Route>
                        <Route path="/main/create-task">
                            <CreateTask />
                        </Route>
                        <Route path="/main/profile">
                            <Profile />
                        </Route>
                        <Route path="/main/users-list">
                            <UsersList />
                        </Route>
                        <Route path="/main/user-form">
                            <UserForm />
                        </Route>
                    </Switch>
                </main>
            </div >
        </Router >
    );
}
export default MainComponent;