import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    redirectButton: {
        margin: '0 auto',
        display: 'block',
        width: "19rem",
    }
}));

const StartPage = () => {
    const classes = useStyles();

    return (
        <div>
            <h2>Start Page</h2>
            <Link to="/login">
                <Button
                    className={classes.redirectButton}
                    variant="contained"
                    color="primary"
                >Login Page</Button>
            </Link>
        </div>
    );
}
export default StartPage;