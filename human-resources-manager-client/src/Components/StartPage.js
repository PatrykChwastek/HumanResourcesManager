import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    redirectButton: {
        margin: '8px',
        width: "10rem",
    },
    mainCard: {
        margin: '0 auto',
        marginTop: '32px',
        display: 'block',
        maxWidth: 750,
    },
    cardMedia: {
        height: 350,
    },
}));

const StartPage = () => {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.mainCard}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Human Resources Manager
                        </Typography>
                        <Typography variant="body1" color="textSecondary" component="p">
                            A prototype application. To store employees data, and assign tasks to them.
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Link style={{ textDecoration: "none" }} to="/login">
                        <Button
                            className={classes.redirectButton}
                            variant="contained"
                            color="primary"
                        >To Login Page</Button>
                    </Link>
                </CardActions>
            </Card>

        </div>
    );
}
export default StartPage;