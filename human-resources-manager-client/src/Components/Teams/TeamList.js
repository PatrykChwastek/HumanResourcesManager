import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import APIURL from '../../Services/Globals';
import { Link, useHistory } from "react-router-dom";
import { DarkTextField, DarkSelect } from '../GlobalComponents';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
import ListItemIcon from '@material-ui/core/ListItemIcon';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
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
        minHeight: '550px',
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
const TeamList = () => {
    const classes = useStyles();
    const history = useHistory();
    const [teams, setTeams] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [menuAnchorEl, setMenuAnchorEl] = useState({ team: null, member: null, id: 0 });
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 1
    });

    useEffect(() => {
        loadTeams(
            pagination.page,
            pagination.size
        );
    }, []);

    const loadTeams = async (page, size) => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        await fetch(APIURL + `teams?page=${page}&size=${size}`,
            requestOptions
        )
            .then(response => response.json())
            .then((data) => {
                setPagination({
                    page: page,
                    size: size,
                    totalPages: data.totalPages,
                })
                setSelectedIndex(0);
                setTeams(data.items);
            });
    };

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handlePageChange = (event, value) => {
        loadTeams(value, pagination.size);
    };

    const handleOptinsClick = (event, menu, id) => {
        if (menu === 'team') {
            setMenuAnchorEl({ team: event.currentTarget, member: null, id: id });
            return;
        }
        setMenuAnchorEl({ team: null, member: event.currentTarget, id: id });
    };
    const handleMenuClose = () => {
        setMenuAnchorEl({ team: null, member: null, id: 0 });
    };

    const handleEditTeam = () => {
        console.log(' to-do');

    }

    const handleDeleteTeam = () => {
        console.log(' to-do');

    };

    const handleViewMember = () => {
        history.push(`/main/employee-details/${menuAnchorEl.id}`)
    };

    const handleRemoveMember = () => {
        console.log(' to-do');
    };

    return (
        <div>
            {teams.length === 0 ? null :
                <div className={classes.teamsContainer}>
                    <List component="nav" className={classes.listComponent}>
                        <div className={classes.title}>
                            <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                Team List:
                            </Typography>
                            <Link className={classes.linkButton} to="/main/create-task">
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<AddCircleIcon />}
                                >NEW Team</Button>
                            </Link>
                        </div>
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
                                        <IconButton edge="end" onClick={(e) => { handleOptinsClick(e, 'team', team.id) }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="team-menu"
                                            anchorEl={menuAnchorEl.team}
                                            keepMounted
                                            open={Boolean(menuAnchorEl.team)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem className={classes.menuItem} onClick={handleEditTeam}>
                                                <ListItemIcon>
                                                    <EditIcon fontSize="small" />
                                                </ListItemIcon>
                                                Edit Team
                                            </MenuItem>
                                            <MenuItem className={classes.menuItem} onClick={handleDeleteTeam}>
                                                <ListItemIcon>
                                                    <DeleteIcon fontSize="small" />
                                                </ListItemIcon>
                                                Delete Team
                                            </MenuItem>
                                        </Menu>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                            </div>
                        ))
                        }
                        <Pagination
                            className={classes.pagination}
                            count={pagination.totalPages}
                            page={pagination.page}
                            onChange={handlePageChange}
                            variant="outlined"
                        />
                    </List>
                    <List component="nav" className={classes.listComponent}>
                        <div className={classes.title}>
                            <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                Team Members:
                            </Typography>
                            <Link className={classes.linkButton} to="/main/create-task">
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<AddCircleIcon />}
                                >Add Member</Button>
                            </Link>
                        </div>
                        {teams[selectedIndex].members.length <= 0 ? <p>No Members</p> :
                            <React.Fragment>
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
                                                <IconButton edge="end" aria-label="comments" onClick={(e) => handleOptinsClick(e, 'member', member.id)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={menuAnchorEl.member}
                                                    keepMounted
                                                    open={Boolean(menuAnchorEl.member)}
                                                    onClose={handleMenuClose}
                                                >
                                                    <MenuItem className={classes.menuItem} onClick={handleViewMember}>
                                                        <ListItemIcon>
                                                            <VisibilityIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        Employee Details
                                                    </MenuItem>
                                                    <MenuItem className={classes.menuItem} onClick={handleRemoveMember}>
                                                        <ListItemIcon>
                                                            <DeleteIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        Remove From Team
                                                    </MenuItem>
                                                </Menu>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                                    </div>
                                ))}
                            </React.Fragment>
                        }
                    </List>
                </div>
            }
        </div>
    )
}
export default TeamList;