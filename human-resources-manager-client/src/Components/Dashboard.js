import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import APIURL from '../Services/Globals'
import { Link } from "react-router-dom";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VisibilityIcon from '@material-ui/icons/Visibility';


function CircularProgressWithLabel(props) {
    const classes = useStyles();
    return (
        <Box className={classes.progressBox} position="relative" display="inline-flex">
            <CircularProgress className={classes.progressBox} variant="determinate" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h5" component="div">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
    },
    body: {
        backgroundColor: theme.palette.grey[400],
        color: "black",
    },
}))(TableCell)

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '1.5rem',
        width: '100%',
        background: theme.palette.grey[800],
        color: "white",
    },
    remoteWorkBox: {
        marginTop: '1.5rem',
        width: "307px",
        padding: "10px",
        background: theme.palette.grey[800],
        color: "white",
    },
    statsBox: {
        marginTop: '1.5rem',
        marginLeft: '1.5rem',
        width: "120px",
        height: "60px",
        padding: "12px",
        position: "relative",
        background: theme.palette.grey[800],
        color: "white",
    },
    progressBox: {
        width: "100% !important",
        height: "100% !important",
    },
    container: {
        maxHeight: 540,
    },
    button: {
        background: theme.palette.grey[300],
        padding: ".4rem",
        "margin-left": ".2rem",
        "margin-right": ".2rem",
        color: theme.palette.grey[800]
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState();
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        if (stats !== undefined) {
            const timer = setInterval(() => {
                setProgress((prevProgress) => (prevProgress === stats.remoteEmploeesPercentage
                    ? stats.remoteEmploeesPercentage
                    : prevProgress + 1));
            }, 45);
            return () => {
                clearInterval(timer);
            };
        }
    }, [stats]);

    useEffect(() => {
        console.log(APIURL);
        getEmploees(1, 5);
        getStats();
    }, []);

    const getEmploees = async (page, size) => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        await fetch(APIURL +
            `employee/all?page=${page}&size=${size}&order=date-desc`, requestOptions)
            .then(response => response.json())
            .then(data => (setEmployees(data.items), console.log(data.items)));
    }

    const getStats = async () => {
        const requestOptions = {
            method: 'Get'
        };
        await fetch(APIURL + `home/stats`, requestOptions)
            .then(response => response.json())
            .then(data => (setStats(data)));
    }

    return (
        <div>
            {stats === undefined ? <div></div> :
                <Grid container>
                    <Card className={classes.remoteWorkBox}>
                        <Grid container item spacing={4}>
                            <Grid item xs={7} >
                                <Typography noWrap variant="h5">{stats.totalRemoteEmployees} Employees</Typography>
                                <Typography noWrap variant="subtitle1">Work Remotely</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <CircularProgressWithLabel value={progress} />
                            </Grid>
                        </Grid>
                    </Card>
                    <Card className={classes.statsBox}>
                        <Typography noWrap variant="h5">{stats.totalEmployees}</Typography>
                        <Typography noWrap variant="subtitle1">Total Employees</Typography>
                    </Card>
                    <Card className={classes.statsBox}>
                        <Typography noWrap variant="h5">{stats.totalJobApplications}</Typography>
                        <Typography noWrap variant="subtitle1">Job Applicatios</Typography>
                    </Card>
                </Grid>
            }
            {employees === undefined ? <div></div> :
                <Card className={classes.root}>
                    <CardHeader
                        title="Newly Hired Employees:"
                    />

                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="center">
                                        #
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        ID
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Name
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Surname
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Email
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Position
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Department
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Remote Work
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Employment Date
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {employees.map((employee, index) => (
                                    <TableRow hover key={employee.id}>
                                        <StyledTableCell align="center">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.id}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.person.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.person.surname}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.person.email}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.position.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.department.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.remoteWork === true ?
                                                <CheckCircleIcon /> : <CloseIcon />}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {employee.employmentDate.toString().split('T')[0]}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Link to={{ pathname: `/main/employee-details/${employee.id}` }}>
                                                <IconButton className={classes.button} size="small" aria-label="view">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Link>
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            }
        </div>
    );
}
export default Dashboard;