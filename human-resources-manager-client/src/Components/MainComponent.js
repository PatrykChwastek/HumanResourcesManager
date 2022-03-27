import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import { getUserAccess, logout, getCurrentUser } from '../Services/AuthService';
import { makeStyles } from '@material-ui/core/styles';
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

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import EventNoteIcon from '@material-ui/icons/EventNote';
import PollIcon from '@material-ui/icons/Poll';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        marginTop: '123px'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    drawerContainer: {
        marginTop: '65px',
    },
    content: {
        flexGrow: 1,
        padding: '1.5rem',
        paddingTop: '5rem',
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth + 73,
    },
    contentShift: {
        flexGrow: 1,
        padding: '1.5rem',
        paddingTop: '5rem',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    navList: {
        '& .MuiSvgIcon-root': {
            marginLeft: '4px',
            width: '32px',
            height: '32px',
        },
    },
    linkButtons: {
        textDecoration: "none",
        color: "white",
    },
}));

const MainComponent = () => {
    const history = useHistory();
    const [userAccess] = useState(getUserAccess());
    const [navIsOpen, setNavIsOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(
        history.location.pathname.substr(history.location.pathname.lastIndexOf('/') + 1));


    const isNavItemmSelected = (name) => {
        console.log(name);
        if (name === currentLocation) {
            return true;
        }
        return false;
    }
    const handleLogout = () => {
        logout();
        history.push("/login");
    }
    const classes = useStyles();
    return (
        <Router>
            <div className={classes.root}>
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                >
                    <Toolbar>
                        {navIsOpen ?
                            <IconButton
                                onClick={() => setNavIsOpen(false)}
                                edge="start"
                                className={classes.menuButton}
                            >
                                <ChevronLeftIcon />
                            </IconButton> :
                            <IconButton
                                color="inherit"
                                onClick={() => setNavIsOpen(true)}
                                edge="start"
                                className={classes.menuButton}
                            >
                                <MenuIcon />
                            </IconButton>
                        }
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
                    className={
                        classes.drawer +
                            navIsOpen ? classes.drawerOpen :
                            classes.drawerClose
                    }
                    variant="permanent"
                    classes={{
                        paper: navIsOpen ? classes.drawerOpen :
                            classes.drawerClose
                    }}
                >
                    <div className={classes.drawerContainer}>

                        <List component="nav" className={classes.navList}>
                            {userAccess.humanResources === false ? null :
                                <React.Fragment>
                                    <Link className={classes.linkButtons} to="/main/dashboard">
                                        <ListItem button
                                            selected={isNavItemmSelected('dashboard')}
                                            onClick={() => setCurrentLocation('dashboard')}
                                        >
                                            <ListItemIcon><PollIcon /></ListItemIcon>
                                            <ListItemText primary={<Typography noWrap>Dashboard</Typography>} />
                                        </ListItem>
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/hr-manager">
                                        <ListItem button
                                            selected={isNavItemmSelected('hr-manager')}
                                            onClick={() => setCurrentLocation('hr-manager')}
                                        >
                                            <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                                            <ListItemText primary={<Typography noWrap>HR-Manager</Typography>} />
                                        </ListItem>
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/employees">
                                        <ListItem button
                                            selected={isNavItemmSelected('employees')}
                                            onClick={() => setCurrentLocation('employees')}
                                        >
                                            <ListItemIcon><PeopleAltIcon /></ListItemIcon>
                                            <ListItemText primary={<Typography noWrap>Employees</Typography>} />
                                        </ListItem>
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/applications">
                                        <ListItem button
                                            selected={isNavItemmSelected('applications')}
                                            onClick={() => setCurrentLocation('applications')}
                                        >
                                            <ListItemIcon><AssignmentIcon /></ListItemIcon>
                                            <ListItemText primary={<Typography noWrap>Job Applications</Typography>} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                </React.Fragment>}
                            <Link className={classes.linkButtons} to="/main/tasks-columns">
                                <ListItem button
                                    selected={isNavItemmSelected('tasks-columns')}
                                    onClick={() => setCurrentLocation('tasks-columns')}
                                >
                                    <ListItemIcon><DateRangeIcon /></ListItemIcon>
                                    <ListItemText primary={<Typography noWrap>Tasks</Typography>} />
                                </ListItem>
                            </Link>
                            <Link className={classes.linkButtons} to="/main/tasks-list">
                                <ListItem button
                                    selected={isNavItemmSelected('tasks-list')}
                                    onClick={() => setCurrentLocation('tasks-list')}
                                >
                                    <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                                    <ListItemText primary={<Typography noWrap>Task List</Typography>} />
                                </ListItem>
                            </Link>
                            <Divider />
                            {userAccess.teamManager === false ? null :
                                <React.Fragment>
                                    <Link className={classes.linkButtons} to="/main/team-manager">
                                        <ListItem button
                                            selected={isNavItemmSelected('team-manager')}
                                            onClick={() => setCurrentLocation('team-manager')}
                                        >
                                            <ListItemIcon><DeveloperBoardIcon /></ListItemIcon>
                                            <ListItemText primary={<Typography noWrap>Team Manager</Typography>} />
                                        </ListItem>
                                    </Link>
                                    <Link className={classes.linkButtons} to="/main/team-tasks">
                                        <ListItem button
                                            selected={isNavItemmSelected('team-tasks')}
                                            onClick={() => setCurrentLocation('team-tasks')}
                                        >
                                            <ListItemIcon><EventNoteIcon /></ListItemIcon>
                                            <ListItemText primary={<Typography noWrap>Team Tasks</Typography>} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                </React.Fragment>}
                            {userAccess.admin === false ? null :
                                <React.Fragment>
                                    <Link className={classes.linkButtons} to="/main/users-list">
                                        <ListItem button
                                            selected={isNavItemmSelected('users-list')}
                                            onClick={() => setCurrentLocation('users-list')}
                                        >
                                            <ListItemIcon><RecentActorsIcon /></ListItemIcon>
                                            <ListItemText primary={<Typography noWrap>Users</Typography>} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                </React.Fragment>}
                        </List>
                    </div>
                </Drawer>
                <main className={navIsOpen ? classes.contentShift : classes.content}>
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