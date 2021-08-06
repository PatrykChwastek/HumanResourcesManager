import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import EmployeeList from './Components/EmployeeList';
import Home from './Components/Home';
import CreateJobApplication from './Components/CreateJobApplication';
import CreateEmployee from './Components/CreateEmployee';
import { EmployeeDetails } from './Components/EmployeeDetails';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

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

const theme = createTheme({
  palette: {
    secondary: {
      light: "#3b783d",
      main: "#367338",
      dark: "#2e6630",
      contrastText: "#fff"
    },
    type: 'dark'
  }
})
const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                Human Resources Manager
              </Typography>
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
                <Link className={classes.linkButtons} to="/">
                  <ListItem button to="/">
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>
                <Link className={classes.linkButtons} to="/employees">
                  <ListItem button>
                    <ListItemText primary="Employees" />
                  </ListItem>
                </Link>
                <Link className={classes.linkButtons} to="/create-employee">
                  <ListItem button>
                    <ListItemText primary="Create Employee" />
                  </ListItem>
                </Link>
                <Link className={classes.linkButtons} to="/applications">
                  <ListItem button>
                    <ListItemText primary="Applications" />
                  </ListItem>
                </Link>
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/create-employee" exact>
                <CreateEmployee />
              </Route>
              <Route path="/employees" exact>
                <EmployeeList />
              </Route>
              <Route path="/employee-details/:id" exact>
                <EmployeeDetails />
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
