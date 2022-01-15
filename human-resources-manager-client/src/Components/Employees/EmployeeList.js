import React, { useEffect, useState } from "react";
import { DarkTextField, DarkSelect } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

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
import Toolbar from '@material-ui/core/Toolbar';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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

const EmployList = () => {
    const classes = useStyles();
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(1);
    const firstRecord = { id: 0, name: "All" };
    const [orderOptions] = useState([
        { id: "name", name: "Name" },
        { id: "surname", name: "Surame" },
        { id: "department", name: "Department" },
        { id: "position", name: "Position" },
        { id: "date-asc", name: "Date-asc" },
        { id: "date-desc", name: "Date-desc" }
    ]);
    const [remoteOptions] = useState([
        { id: '', name: "All" },
        { id: true, name: "Remote" },
        { id: false, name: "Office" },
    ]);
    const [searchParams, setSearchParams] = useState({
        searchString: '',
        department: firstRecord,
        position: firstRecord,
        orderBy: orderOptions[4],
        isRemote: remoteOptions[0]
    });
    useEffect(() => {
        getEmploees(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);

    useEffect(() => {
        getSearchProps()
    }, []);

    const getEmploees = async (page, size) => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        await fetch(APIURL +
            `employee/all?page=${page}&size=${size}&order=${searchParams.orderBy.id}&search=${searchParams.searchString}&department=${searchParams.department.id}&position=${searchParams.position.id}&isremote=${searchParams.isRemote.id}`,
            requestOptions
        )
            .then(response => response.json())
            .then(data => (setEmployees(data.items), setTotalItems(data.totalItems)));
    }

    const getSearchProps = async () => {
        const requestOptions = {
            method: 'Get',
        };
        await fetch(APIURL + `departments`,
            requestOptions
        )
            .then(response => response.json())
            .then(data => { data.unshift(firstRecord); setDepartments(data) });

        await fetch(APIURL + `positions`,
            requestOptions
        )
            .then(response => response.json())
            .then(data => { data.unshift(firstRecord); setPositions(data) });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeSearchParams = event => {
        setSearchParams({
            searchParams,
            searchString: event.target.name === "searchInput" ? event.target.value : searchParams.searchString,
            department: event.target.name === "departmentSelect" ? event.target.value : searchParams.department,
            position: event.target.name === "positionSelect" ? event.target.value : searchParams.position,
            orderBy: event.target.name === "orderBy" ? event.target.value : searchParams.orderBy,
            isRemote: event.target.name === "isRemote" ? event.target.value : searchParams.isRemote,
        });
    };

    const handleSearch = () => {
        getEmploees(1, rowsPerPage);
        console.log(searchParams);
    };
    return (
        <div>
            <Toolbar className={classes.searchBox}>
                <h3 className={classes.whiteText}>Employees</h3>
                <DarkTextField
                    onChange={handleChangeSearchParams}
                    label='Search...'
                    name='searchInput'
                />
                <DarkSelect
                    label="Department"
                    name="departmentSelect"
                    collection={departments}
                    value={searchParams.department}
                    onChange={handleChangeSearchParams}
                />
                <DarkSelect
                    label="Position"
                    name="positionSelect"
                    collection={positions}
                    value={searchParams.position}
                    onChange={handleChangeSearchParams}
                />
                <DarkSelect
                    label="Order by"
                    name="orderBy"
                    collection={orderOptions}
                    value={searchParams.orderBy}
                    onChange={handleChangeSearchParams}
                />
                <DarkSelect
                    label="Work Type"
                    name="isRemote"
                    collection={remoteOptions}
                    value={searchParams.isRemote}
                    onChange={handleChangeSearchParams}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
            </Toolbar>

            {employees === undefined ? <div></div> :
                <Paper className={classes.root}>
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
                                    <StyledTableCell align="center">
                                        Action
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {employees.map((employee, index) => (
                                    <TableRow hover key={index}>
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
                                            <IconButton className={classes.button} size="small" aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton className={classes.button} size="small" aria-label="del">
                                                <DeleteIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.pagination}
                        rowsPerPageOptions={[10, 25, 35]}
                        component="div"
                        count={totalItems}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            }
        </div>
    );
}
export default EmployList;