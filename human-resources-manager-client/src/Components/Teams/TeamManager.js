import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import APIURL from '../../Services/Globals';
import { getCurrentUser } from '../../Services/AuthService';
import { Link } from "react-router-dom";

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
        marginTop: '1rem',
        width: '100%',
    },
    container: {
        maxHeight: 550,
    },
    pagination: {
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
    searchBox: {
        padding: ".1rem",
        paddingLeft: "1.8rem",
        paddingRight: "1.8rem",
        width: "max-content",
        background: theme.palette.grey[800],
        boxShadow:
            "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    },
    whiteText: {
        color: "white",
        marginLeft: "0px",
        marginRight: "8px",
    },
}));
const leaderID = getCurrentUser().userDetails.employeeDTO.id;
const TeamManager = () => {
    const classes = useStyles();

    const [team, setTeam] = useState({});

    useEffect(() => {
        getTeam();
    }, []);

    const getTeam = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        await fetch(APIURL + `teams/leader/${leaderID}`, requestOptions)
            .then(response => response.json())
            .then(data => (setTeam(data), console.log(data)));
    }
    return (
        <div>
            {team.members === undefined ? <div></div> :
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
export default TeamManager;