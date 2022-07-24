import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import LoginUser from './Components/Users/LoginUser';
import MainComponent from './Components/MainComponent';
import StartPage from './Components/StartPage';
import CreateJobApplication from './Components/JobApplication/CreateJobApplication';

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
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <StartPage />
          </Route>
          <Route path="/login">
            <LoginUser />
          </Route>
          <Route path="/submit-application/:id" >
            <CreateJobApplication />
          </Route>
          <Route path="/main" >
            <MainComponent />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
