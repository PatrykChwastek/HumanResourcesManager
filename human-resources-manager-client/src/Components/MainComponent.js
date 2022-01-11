import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import EmployeeList from './EmployeeList';
import Dashboard from './Dashboard';
import CreateJobApplication from './CreateJobApplication';
import CreateEmployee from './CreateEmployee';
import { EmployeeDetails } from './EmployeeDetails';
import LoginUser from './LoginUser';
import TeamManager from './TeamManager';
import UserTasks from './UserTasks';
import { getUserAccess, logout } from '../Services/AuthService';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

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
                        <List>
                            {userAccess.humanResources === false ? null :
                                <Link className={classes.linkButtons} to="/main/dashboard">
                                    <ListItem button>
                                        <ListItemText primary="Dashboard" />
                                    </ListItem>
                                </Link>
                            }
                            <Link className={classes.linkButtons} to="/main/tasks">
                                <ListItem button>
                                    <ListItemText primary="My Tasks" />
                                </ListItem>
                            </Link>
                            {userAccess.humanResources === false ? null :
                                <Link className={classes.linkButtons} to="/main/employees">
                                    <ListItem button>
                                        <ListItemText primary="Employees" />
                                    </ListItem>
                                </Link>
                            }
                            {userAccess.humanResources === false ? null :
                                <Link className={classes.linkButtons} to="/main/create-employee">
                                    <ListItem button>
                                        <ListItemText primary="Create Employee" />
                                    </ListItem>
                                </Link>
                            }
                            {userAccess.teamManager === false ? null :
                                <Link className={classes.linkButtons} to="/main/team-manager">
                                    <ListItem button>
                                        <ListItemText primary="Team-Manager" />
                                    </ListItem>
                                </Link>
                            }
                            {userAccess.humanResources === false ? null :
                                <Link className={classes.linkButtons} to="/main/applications">
                                    <ListItem button>
                                        <ListItemText primary="Applications" />
                                    </ListItem>
                                </Link>
                            }
                            <Link className={classes.linkButtons} to="/login">
                                <ListItem button>
                                    <ListItemText primary="Login" />
                                </ListItem>
                            </Link>
                        </List>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Switch>
                        <Route path="/main/dashboard">
                            <Dashboard />
                        </Route>
                        <Route path="/main/tasks">
                            <UserTasks />
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