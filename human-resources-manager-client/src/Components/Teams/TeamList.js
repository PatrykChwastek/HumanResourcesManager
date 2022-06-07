import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import APIURL from '../../Services/Globals';
import { authHeader } from '../../Services/AuthService'
import { Link, useHistory } from "react-router-dom";
import { DarkTextField, DarkSelect, ConfirmDialog } from '../GlobalComponents';

import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Pagination from '@material-ui/lab/Pagination';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    filterBox: {
        padding: ".1rem",
        paddingLeft: "1.1rem",
        paddingRight: "1.1rem",
        borderRadius: '4px',
        marginLeft: '8px',
        width: "max-content",
        background: theme.palette.grey[800],
        boxShadow:
            "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    },
    whiteText: {
        color: "white",
        margin: "0px",
        marginRight: "8px",
    },
    teamsContainer: {
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    listComponent: {
        margin: '8px',
        width: '100%',
        minHeight: '700px',
        maxHeight: '700px',
        paddingTop: 0,
        backgroundColor: theme.palette.background.paper,
        color: 'white',
        boxShadow: theme.shadows[2],
        borderRadius: '4px',
        display: "flex",
        flexDirection: 'column'
    },
    pagination: {
        display: 'grid',
        padding: '8px',
        marginTop: 'auto',
        "& .Mui-selected": {
            color: 'white',
            backgroundColor: 'rgb(63 81 181 / 80%)',
        },
        "& .MuiPaginationItem-outlined": {
            boxShadow: theme.shadows[2],
            border: '1px solid rgb(149 149 149 / 23%)'
        }
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '6px 0',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        borderRadius: '3px 3px 0 0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    linkButton: {
        marginRight: '10px',
        marginLeft: 'auto',
        textDecoration: "none",
        color: "white",
    },

    teamMembersCol: {
        margin: "8px",
        width: '100%',
        display: "flex",
        flexDirection: "column",
    },
    menuItem: {
        textDecoration: "none",
        color: "white",
        "& .MuiListItemIcon-root": {
            minWidth: '32px'
        }
    }
}));

const searchMode = [
    { id: 'all', name: 'Show All' },
    { id: 'teamName', name: 'Team Name' },
    { id: 'leaderName', name: 'Team Leader Name' },
    { id: 'memberName', name: 'Member Name' },]

const TeamList = () => {
    const classes = useStyles();
    const history = useHistory();
    const [teams, setTeams] = useState([]);
    const [searchParams, setSearchParams] = useState({ searchBy: searchMode[0].id, search: '' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 9,
        totalPages: 1
    });
    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
    });
    const [delDialogProps, setDelDialogProps] = useState({
        open: false,
        data: null,
        type: '',
        title: '',
        text: ''
    });

    useEffect(() => {
        loadTeams(
            pagination.page,
            pagination.size
        );
    }, []);

    const loadTeams = async (page, size, selTeam) => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
        };
        let requestUrl = `teams?page=${page}&size=${size}`;

        if (searchParams.searchBy !== 'all') {
            requestUrl =
                `teams?page=${page}&size=${size}` +
                `&searchby=${searchParams.searchBy}&search=${searchParams.search}`;
        }

        await fetch(APIURL + requestUrl, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setPagination({
                    page: page,
                    size: size,
                    totalPages: data.totalPages,
                })
                setSelectedIndex(selTeam === undefined ? 0 : selTeam);
                setTeams(data.items);
            });
    };

    const handleChangeSearchParams = e => {
        if (e.target.name === 'searchBySel') {
            setSearchParams({
                ...searchParams,
                searchBy: e.target.value.id
            })
            return;
        }

        setSearchParams({
            ...searchParams,
            search: e.target.value
        })
    };

    const handleSearchTeam = () => {
        loadTeams(1, pagination.size);
    };

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handlePageChange = (event, value) => {
        loadTeams(value, pagination.size);
    };

    const handleEditTeam = () => {
        console.log(' to-o');

    }

    const handleDeleteTeam = (teamId) => {
        const requestOptions = {
            method: 'Delete',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
        };

        fetch(APIURL + 'teams/' + teamId, requestOptions)
            .then((data) => {
                console.log(data);
                loadTeams(
                    pagination.page,
                    pagination.size,
                    selectedIndex
                );
                setAllertProps({
                    text: "Team Removed",
                    open: true,
                    type: "success"
                });
            }, (err) => {
                console.log(err)
                setAllertProps({
                    text: "Team Remove Error!",
                    open: true,
                    type: "error"
                })
            });

    };

    const handleViewMember = (id) => {
        history.push(`/main/employee-details/${id}`)
    };

    const handleRemoveMember = async (id) => {
        const teamMembers = teams[selectedIndex].members.filter((e) => e.id !== id)
        let membersID = [];

        teamMembers.forEach(member => {
            membersID.push(member.id);
        });
        const requestOptions = {
            method: 'Put',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
            body: JSON.stringify(membersID)
        };
        await fetch(APIURL + `teams/members/${teams[selectedIndex].id}`,
            requestOptions
        ).then(data => {
            console.log(data);
            loadTeams(
                pagination.page,
                pagination.size,
                selectedIndex
            );
            setAllertProps({
                text: "Member Removed",
                open: true,
                type: "success"
            });
        }, (err) => {
            console.log(err)
            setAllertProps({
                text: "Member Remove Error!",
                open: true,
                type: "error"
            })
        });
    };

    const delDialogOpen = () => {
        setDelDialogProps({ ...delDialogProps, open: !delDialogProps.open })
    }
    const onDialogConfirm = () => {
        switch (delDialogProps.type) {
            case 'memberRemove':
                handleRemoveMember(delDialogProps.data);
                break;
            case 'teamRemove':
                handleDeleteTeam(delDialogProps.data)
                break;
        }
    }
    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    const listSkeleton = () => {
        return (
            <React.Fragment>
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
                <Skeleton style={{ marginLeft: '15px' }} width="95%" height="75px" />
            </React.Fragment>
        );
    }

    const membersSkeleton = () => {
        return (
            <List component="nav" className={classes.listComponent}>
                <div className={classes.title}>
                    <Typography variant="h6" style={{ marginLeft: '16px' }}>
                        Team Members:
                    </Typography>
                    <a className={classes.linkButton}></a>
                </div>
                {listSkeleton()}
            </List>
        );
    }

    return (
        <div>
            <ConfirmDialog
                title={delDialogProps.title}
                open={delDialogProps.open}
                setOpen={delDialogOpen}
                onConfirm={onDialogConfirm}
            >
                {delDialogProps.text}
            </ConfirmDialog>
            <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                <Alert onClose={handleAllertClose} severity={allertProps.type}>
                    {allertProps.text}
                </Alert>
            </Snackbar>
            <Toolbar className={classes.filterBox}>
                <h3 className={classes.whiteText}>Search Team: </h3>
                <DarkSelect
                    label="Search by:"
                    name="searchBySel"
                    collection={searchMode}
                    defaultValue={searchMode[0]}
                    onChange={handleChangeSearchParams}
                />
                <DarkTextField
                    onChange={handleChangeSearchParams}
                    disabled={searchParams.searchBy === 'all'}
                    label='Search...'
                    name='searchTF'
                />
                <Button
                    style={{ marginLeft: '15px' }}
                    variant="contained"
                    color="primary"
                    onClick={handleSearchTeam}
                >Search</Button>
            </Toolbar>

            <div className={classes.teamsContainer}>
                <List component="nav" className={classes.listComponent}>
                    <div className={classes.title}>
                        <Typography variant="h6" style={{ marginLeft: '16px' }}>
                            Team List:
                        </Typography>
                        <Link className={classes.linkButton} to="/main/create-team">
                            <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                endIcon={<AddCircleIcon />}
                            >NEW Team</Button>
                        </Link>
                    </div>
                    {teams.length === 0 ? listSkeleton() :
                        <React.Fragment>
                            {teams.map((team, index) => (
                                <div key={team.id}>
                                    <ListItem
                                        button
                                        selected={selectedIndex === index}
                                        onClick={(event) => handleListItemClick(event, index)}
                                    >
                                        <ListItemText
                                            primary={'Team Name: ' + team.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textPrimary"
                                                    >
                                                        {'Team Leader: '}
                                                    </Typography>
                                                    {team.teamLeader.person.name + ' ' +
                                                        team.teamLeader.person.surname}

                                                </React.Fragment>
                                            }
                                        />

                                        <p style={{ marginRight: '15px' }}>{'Members: ' + team.members.length}</p>
                                        <ListItemSecondaryAction>
                                            <PopupState variant="popover" popupId="team-menu">
                                                {(popupState) => (
                                                    <React.Fragment>
                                                        <IconButton edge="end" {...bindTrigger(popupState)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu {...bindMenu(popupState)}>
                                                            <Link style={{ textDecoration: 'none' }} to={{ pathname: `/main/create-team`, team: team }}>
                                                                <MenuItem className={classes.menuItem} onClick={handleEditTeam}>
                                                                    <ListItemIcon>
                                                                        <EditIcon fontSize="small" />
                                                                    </ListItemIcon>
                                                                    Edit Team
                                                                </MenuItem>
                                                            </Link>
                                                            <MenuItem className={classes.menuItem} onClick={(e) =>
                                                                setDelDialogProps({
                                                                    open: true,
                                                                    data: team.id,
                                                                    type: 'teamRemove',
                                                                    title: `Remove Team : ${team.name}`,
                                                                    text: 'Are you sure you want to remove this team?'
                                                                })}>
                                                                <ListItemIcon>
                                                                    <DeleteIcon fontSize="small" />
                                                                </ListItemIcon>
                                                                Delete Team
                                                            </MenuItem>
                                                        </Menu>
                                                    </React.Fragment>
                                                )}
                                            </PopupState>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                                </div>
                            ))}
                            <Pagination
                                className={classes.pagination}
                                count={pagination.totalPages}
                                page={pagination.page}
                                onChange={handlePageChange}
                                variant="outlined"
                            />
                        </React.Fragment>
                    }
                </List>
                {teams.length === 0 ? membersSkeleton() :
                    <List component="nav" className={classes.listComponent}>
                        <div className={classes.title}>
                            <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                Team Members:
                            </Typography>

                            <Link className={classes.linkButton} to={{
                                pathname: "/main/add-team-members",
                                members: teams[selectedIndex].members,
                                teamid: teams[selectedIndex].id
                            }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<EditIcon />}
                                >Set Members</Button>
                            </Link>

                        </div>
                        {teams[selectedIndex].members.length <= 0 ? <p style={{ marginLeft: '12px' }}>No Members</p> :
                            <div style={{ overflow: 'auto', }}>
                                {teams[selectedIndex].members.map((member, index) => (
                                    <div key={"member" + member.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={member.person.name + " " + member.person.surname}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="textPrimary"
                                                        >
                                                            {'Position: '}
                                                        </Typography>
                                                        {member.seniority + ' ' + member.position.name}
                                                    </React.Fragment>
                                                }
                                            />
                                            <p>Email:</p>
                                            <p style={{ marginRight: '9px', marginLeft: '5px', color: 'rgba(255, 255, 255, 0.7)' }}>{member.person.email}</p>
                                            <ListItemSecondaryAction>
                                                <PopupState variant="popover" popupId="member-menu">
                                                    {(popupState) => (
                                                        <React.Fragment>
                                                            <IconButton edge="end" {...bindTrigger(popupState)}>
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <Menu {...bindMenu(popupState)}>
                                                                <MenuItem className={classes.menuItem} onClick={() => handleViewMember(member.id)}>
                                                                    <ListItemIcon>
                                                                        <VisibilityIcon fontSize="small" />
                                                                    </ListItemIcon>
                                                                    Employee Details
                                                                </MenuItem>
                                                                <MenuItem className={classes.menuItem} onClick={(e) =>
                                                                    setDelDialogProps({
                                                                        open: true,
                                                                        data: member.id,
                                                                        type: 'memberRemove',
                                                                        title: `Remove Team Member: ${member.person.name} ${member.person.surname}`,
                                                                        text: 'Are you sure you want to remove this employee from team?'
                                                                    })}>
                                                                    <ListItemIcon>
                                                                        <DeleteIcon fontSize="small" />
                                                                    </ListItemIcon>
                                                                    Remove From Team
                                                                </MenuItem>
                                                            </Menu>
                                                        </React.Fragment>
                                                    )}
                                                </PopupState>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                                    </div>
                                ))}
                            </div>
                        }
                    </List>}
            </div>
        </div>
    )
}
export default TeamList;