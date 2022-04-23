import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import APIURL from '../../Services/Globals';
import { getCurrentUser, authHeader } from '../../Services/AuthService';
import { Link } from "react-router-dom";
import { getTasks } from "../../Services/TasksService";
import { StatBar } from "../GlobalComponents"

import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';

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
        width: '100%',
    },
    container: {
        maxHeight: 550,
    },
    statsMain: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    barBox: {
        width: 'max-content',
        marginRight: '1rem',
        marginBottom: '1rem',
        minWidth: '366px',
    },
    statsContainer: {
        display: 'flex',
        padding: '0 4px 4px',
        justifyContent: 'space-around'
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '2px 6px 2px',
        marginBottom: '5px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        width: '100%',
    },
    statsBox: {
        margin: '0 1rem 1rem 0',
        width: "120px",
        height: "60px",
        padding: "12px",
        position: "relative",
        background: theme.palette.grey[800],
        color: "white",
    },
    button: {
        background: theme.palette.grey[300],
        padding: ".4rem",
        "margin-left": ".2rem",
        "margin-right": ".2rem",
        color: theme.palette.grey[800],
    },
    whiteText: {
        color: "white",
        marginLeft: "0px",
        marginRight: "8px",
    },
    currentTask: {
        borderRadius: '4px',
        backgroundColor: "green",
        color: "white",
        boxShadow: theme.shadows[2],
    },
    noTask: {
        borderRadius: '4px',
        backgroundColor: "#bd0000",
        color: "white",
        boxShadow: theme.shadows[2],
    },
    skeleton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'space-between',
        margin: '4px',
        '& .MuiSkeleton-root': {
            transform: 'none',
            visibility: 'visible !important'
        }
    }
}));

const Team_Dashboard = () => {
    const classes = useStyles();
    const leaderID = getCurrentUser().userDetails.employeeDTO.id;
    const [team, setTeam] = useState({});
    const [idleMembers, setIdleMembers] = useState(0);
    const [tasksStats, setTasksStats] = useState({});
    const [currentTasks, setCurrentTasks] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (team.members !== undefined && currentTasks.length === team.members.length) {
            let couter = 0;
            currentTasks.forEach(element => {
                if (element === undefined) {
                    couter++;
                }
            });
            setIdleMembers(couter)
        }
    }, [currentTasks]);

    const getData = () => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
        };
        fetch(APIURL + `teams/leader/${leaderID}`, requestOptions)
            .then(response => response.json())
            .then(data => (
                setTeam(data),
                getTasksStats(data.id),
                data.members.map((member) => {
                    getTasks(1, 1, member.id, undefined, "In-Progress").then((data) => {
                        setCurrentTasks(old => [
                            ...old, data.items[0]
                        ])
                    })
                })
            ));
    }

    const getTasksStats = (teamId) => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
        };
        fetch(APIURL + `tasks/stats?teamid=${teamId}`, requestOptions)
            .then(response => response.json())
            .then(data => (setTasksStats(data)));

    }

    const currentTaskBar = (memberId) => {
        let boxStyle = classes.currentTask;
        let text = loadCurrrentTask(memberId);
        if (text === undefined) {
            boxStyle = classes.noTask;
            text = "No Task Assigned";
        }
        return (
            <Typography variant="body1" className={boxStyle}>
                {text}
            </Typography>
        );
    }
    const loadCurrrentTask = (id) => {
        let currTask;
        currentTasks.map(task => {
            if (task !== undefined) {
                if (task.assignedEmployeeId === id) {
                    currTask = task.name;
                }
            }
        });
        return currTask;
    }
    const tasksStatSkeleton = () => {
        return (
            <div className={classes.statsMain}>
                {[1, 2, 3].map((n, index) => (
                    <Card key={index + "skiel"} className={classes.barBox}>
                        <div className={classes.title}>
                            <Typography variant="h6">
                                <Skeleton animation="wave" width="95%" />
                            </Typography>

                        </div>
                        <div className={classes.statsContainer}>
                            <Skeleton className={classes.skeleton} animation="wave" variant="rect" width="102px" height="160px" >
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton width="32px" height="102px" />
                                <Skeleton animation="wave" width="17px" height="15px" style={{ marginBottom: '5px' }} />
                            </Skeleton>
                            <Skeleton className={classes.skeleton} animation="wave" variant="rect" width="102px" height="160px" >
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton width="32px" height="102px" />
                                <Skeleton animation="wave" width="17px" height="15px" style={{ marginBottom: '5px' }} />
                            </Skeleton>
                            <Skeleton className={classes.skeleton} animation="wave" variant="rect" width="102px" height="160px" >
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton width="32px" height="102px" />
                                <Skeleton animation="wave" width="17px" height="15px" style={{ marginBottom: '5px' }} />
                            </Skeleton>
                        </div>
                    </Card>
                ))}
                <Card className={classes.statsBox}>
                    <Typography variant="h5"><Skeleton animation="wave" width="42px" /></Typography>
                    <Typography variant="subtitle1"><Skeleton animation="wave" width="95%" /></Typography>
                </Card>
                <Card className={classes.statsBox}>
                    <Typography variant="h5"><Skeleton animation="wave" width="42px" /></Typography>
                    <Typography variant="subtitle1"><Skeleton animation="wave" width="95%" /></Typography>
                </Card>
            </div>
        );
    }

    const tabSkeleton = () => {
        return (
            <Card>
                <Typography style={{ marginLeft: '18px' }} variant="h3"><Skeleton animation="wave" width="21%" /></Typography>
                <Typography style={{ marginLeft: '18px', marginBottom: '12px' }} variant="h6"><Skeleton animation="wave" width="98%" /></Typography>
                <div style={{ padding: '4px', backgroundColor: '#bdbdbd' }}>
                    <Typography style={{ marginLeft: '18px' }} variant="h4"><Skeleton width="98%" /></Typography>
                    <Typography style={{ marginLeft: '18px' }} variant="h4"><Skeleton width="98%" /></Typography>
                    <Typography style={{ marginLeft: '18px' }} variant="h4"><Skeleton width="98%" /></Typography>
                    <Typography style={{ marginLeft: '18px' }} variant="h4"><Skeleton width="98%" /></Typography>

                </div>
            </Card>
        )

    }

    return (
        <div>
            {tasksStats.monthTotal === undefined ? tasksStatSkeleton() :
                <div className={classes.statsMain}>
                    <Card className={classes.barBox}>
                        <div className={classes.title}>
                            <Typography variant="h6">Today Tasks: {tasksStats.todayTotal}</Typography>
                        </div>
                        <div className={classes.statsContainer}>
                            <StatBar
                                valueMax={tasksStats.todayTotal}
                                valueCurrent={tasksStats.todayRequested}
                                text={"Requested: " + tasksStats.todayRequested}
                                bcolor='rgb(231, 170, 35)'
                            />
                            <StatBar
                                valueMax={tasksStats.todayTotal}
                                valueCurrent={tasksStats.todayProgress}
                                text={"In-Progress: " + tasksStats.todayProgress}
                                bcolor='rgb(56, 81, 216)'
                            />
                            <StatBar
                                valueMax={tasksStats.todayTotal}
                                valueCurrent={tasksStats.todayCompleted}
                                text={"Completed: " + tasksStats.todayCompleted}
                                bcolor='rgb(0, 158, 7)'
                            />
                        </div>
                    </Card>
                    <Card className={classes.barBox}>
                        <div className={classes.title}>
                            <Typography variant="h6">This Week Tasks: {tasksStats.weekTotal}</Typography>
                        </div>
                        <div className={classes.statsContainer}>
                            <StatBar
                                valueMax={tasksStats.weekTotal}
                                valueCurrent={tasksStats.weekRequested}
                                text={"Requested: " + tasksStats.weekRequested}
                                bcolor='rgb(231, 170, 35)'
                            />
                            <StatBar
                                valueMax={tasksStats.weekTotal}
                                valueCurrent={tasksStats.weekProgress}
                                text={"In-Progress: " + tasksStats.weekProgress}
                                bcolor='rgb(56, 81, 216)'
                            />
                            <StatBar
                                valueMax={tasksStats.weekTotal}
                                valueCurrent={tasksStats.weekCompleted}
                                text={"Completed: " + tasksStats.weekCompleted}
                                bcolor='rgb(0, 158, 7)'
                            />
                        </div>
                    </Card>
                    <Card className={classes.barBox}>
                        <div className={classes.title}>
                            <Typography variant="h6">This Month Tasks: {tasksStats.monthTotal}</Typography>
                        </div>
                        <div className={classes.statsContainer}>
                            <StatBar
                                valueMax={tasksStats.monthTotal}
                                valueCurrent={tasksStats.monthRequested}
                                text={"Requested: " + tasksStats.monthRequested}
                                bcolor='rgb(231, 170, 35)'
                            />
                            <StatBar
                                valueMax={tasksStats.monthTotal}
                                valueCurrent={tasksStats.monthProgress}
                                text={"In-Progress: " + tasksStats.monthProgress}
                                bcolor='rgb(56, 81, 216)'
                            />
                            <StatBar
                                valueMax={tasksStats.monthTotal}
                                valueCurrent={tasksStats.monthCompleted}
                                text={"Completed: " + tasksStats.monthCompleted}
                                bcolor='rgb(0, 158, 7)'
                            />
                        </div>
                    </Card>
                    <Card className={classes.statsBox}>
                        <Typography noWrap variant="h5">{tasksStats.totalDelayedTasks}</Typography>
                        <Typography noWrap variant="subtitle1">Delayed Tasks</Typography>
                    </Card>
                    <Card className={classes.statsBox}>
                        <Typography noWrap variant="h5">{idleMembers}</Typography>
                        <Typography noWrap variant="subtitle1">Idle Members</Typography>
                    </Card>
                </div>
            }
            {team.members === undefined ? tabSkeleton() :
                <Card className={classes.root}>
                    <CardHeader
                        title={'"' + team.name + '"' + " Team Members:"}
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
                                        Remote Work
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Now Working On
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {team.members.map((employee, index) => (
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
                                            {employee.remoteWork === true ?
                                                <CheckCircleIcon /> : <CloseIcon />}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {currentTasks.length !== team.members.length ?
                                                <Typography variant="h6"><Skeleton width="99%" /></Typography> :
                                                currentTaskBar(employee.id)
                                            }
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
export default Team_Dashboard;