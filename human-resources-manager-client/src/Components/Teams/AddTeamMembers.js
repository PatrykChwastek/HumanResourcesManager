import React, { useEffect, useState } from "react";
import { DarkTextField, DarkSelect, ConfirmDialog } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useLocation } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Toolbar from '@material-ui/core/Toolbar';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
    },
}))(TableCell)

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '1rem',
        width: '100%',
    },
    tab: {
        "& .MuiCheckbox-colorSecondary.Mui-checked": {
            color: '#3f51b5'
        },
        "& .Mui-selected": {
            backgroundColor: theme.palette.grey[500],
        },
        backgroundColor: theme.palette.grey[400],
        "& .MuiTableCell-body": {
            color: 'black',
        },

        "& .MuiTableRow-hover:hover": { backgroundColor: theme.palette.grey[500], },
    },

    tabTop: {
        display: 'flex',
        padding: '9px',
        justifyContent: 'space-between',
        "& h2": {
            margin: '2px',
        },
        "& a": {
            textDecoration: "none",
            color: "white",
        }
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
    selButton: {
        width: '32px',
        height: '32px',
        marginLeft: '8px',
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

const AddTeamMembers = () => {
    const classes = useStyles();
    const location = useLocation();
    const [employees, setEmployees] = useState([]);
    const [selEmployees, setSelEmployees] = useState(location.members !== undefined ? location.members : []);
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
    const [seniorityLvs] = useState([
        firstRecord,
        { id: 1, name: "Junior" },
        { id: 2, name: "Regular" },
        { id: 3, name: "Senior" },
    ]);
    const [searchParams, setSearchParams] = useState({
        searchString: '',
        department: firstRecord,
        position: firstRecord,
        seniority: firstRecord,
        orderBy: orderOptions[4],
        isRemote: remoteOptions[0]
    });

    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
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
            `employee/all?page=${page}&size=${size}&order=${searchParams.orderBy.id}` +
            `&search=${searchParams.searchString}` +
            `&department=${searchParams.department.id}` +
            `&position=${searchParams.position.id}` +
            `&seniority=${searchParams.seniority.id === 0 ? '' : searchParams.seniority.name}` +
            `&isremote=${searchParams.isRemote.id}`,
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
            seniority: event.target.name === "senioritySelect" ? event.target.value : searchParams.seniority,
            orderBy: event.target.name === "orderBy" ? event.target.value : searchParams.orderBy,
            isRemote: event.target.name === "isRemote" ? event.target.value : searchParams.isRemote,
        });
    };

    const handleSearch = () => {
        getEmploees(1, rowsPerPage);
    };

    const hendleAddMembers = async () => {
        let membersID = [];
        selEmployees.forEach(employee => {
            membersID.push(employee.id);
        });

        if (location.teamid !== undefined) {
            const requestOptions = {
                method: 'Put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(membersID)
            };
            await fetch(APIURL + `teams/members/${location.teamid}`,
                requestOptions
            ).then(data => {
                console.log(data);
                setAllertProps({
                    text: "Team Members Set",
                    open: true,
                    type: "success"
                });
            }, (err) => {
                console.log(err)
                setAllertProps({
                    text: "Set Team Members Error!",
                    open: true,
                    type: "error"
                })
            });
        }
    }

    const handleRowClick = (event, employee) => {
        const selectedIndex = selEmployees.findIndex(e => e.id == employee.id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selEmployees, employee);
        }

        if (selectedIndex >= 0) {
            newSelected = selEmployees.filter((e) => e.id !== employee.id);
        }

        setSelEmployees(newSelected);
    }

    const isSelected = (id) => selEmployees.findIndex(e => e.id == id) !== -1;

    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    return (
        <div>
            <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                <Alert onClose={handleAllertClose} severity={allertProps.type}>
                    {allertProps.text}
                </Alert>
            </Snackbar>
            <Toolbar className={classes.searchBox}>
                <h3 className={classes.whiteText}>Search:</h3>
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
                    label="Seniority"
                    name="senioritySelect"
                    collection={seniorityLvs}
                    value={searchParams.seniority}
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
                    <div className={classes.tabTop}>
                        <h2 >Select Team Members:</h2>
                        <Button
                            disabled={selEmployees.length <= 0}
                            variant="contained" color="primary"
                            onClick={hendleAddMembers}
                        >
                            Add Selected
                        </Button>
                    </div>
                    <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                    <TableContainer className={classes.container}>
                        <Table stickyHeader >
                            <TableHead className={classes.tabHead}>
                                <TableRow >
                                    <StyledTableCell align="center">

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
                                        Seniority
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Department
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Remote Work
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tab}>
                                {employees.map((employee, index) => {
                                    const isItemSelected = isSelected(employee.id);
                                    return (
                                        <TableRow
                                            hover
                                            key={index}
                                            role="checkbox"
                                            selected={isItemSelected}
                                            onClick={(e) => handleRowClick(e, employee)}
                                        >
                                            <StyledTableCell align="center">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                />
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
                                                {employee.seniority}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {employee.department.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {employee.remoteWork === true ?
                                                    <CheckCircleIcon /> : <CloseIcon />}
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {selEmployees.length <= 0 ? <div></div> :
                            <div style={{ display: 'flex', marginTop: '8px' }}>
                                <h3 style={{ margin: '6px 0 6px 10px' }}>{'Selected: ' + selEmployees.length}</h3>
                                <Fab className={classes.selButton} color="primary" onClick={() => setEmployees(selEmployees)}><VisibilityIcon /></Fab>
                                <Fab className={classes.selButton} color="primary" onClick={() => setSelEmployees([])}><ClearIcon /></Fab>
                            </div>

                        }
                        <TablePagination
                            className={classes.pagination}
                            rowsPerPageOptions={[10, 25, 35]}
                            component="div"
                            count={totalItems}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </Paper>
            }


        </div>
    );
}
export default AddTeamMembers;