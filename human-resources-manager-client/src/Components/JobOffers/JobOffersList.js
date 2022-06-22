import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import APIURL from '../../Services/Globals';
import { authHeader } from '../../Services/AuthService'
import { Link, useHistory } from "react-router-dom";
import { DarkTextField, DarkSelect, ConfirmDialog, InfoDialog } from '../GlobalComponents';
import JobOfferView from "./JobOfferView";

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
    offersContainer: {
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
    menuItem: {
        textDecoration: "none",
        color: "white",
        "& .MuiListItemIcon-root": {
            minWidth: '32px'
        }
    }
}));

const JobOffersList = () => {
    const classes = useStyles();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState({ offers: true, applications: true });
    const [jobOffers, setJobOffers] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const firstVal = { id: 0, name: 'All' };
    const [searchParams, setSearchParams] = useState({
        name: '',
        position: firstVal,
    });
    const [positions, setPositions] = useState([]);

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
    const [offerViewDialog, setOfferViewDialog] = useState({
        open: false,
        title: '',
        text: '',
        jobOfferId: 0
    });

    useEffect(() => {
        getJobOffers()
        getPositions()
    }, []);

    const getJobOffers = async (selected) => {
        setIsLoading({ offers: true, applications: true })
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
        };

        await fetch(APIURL + 'jobOffers' +
            `?name=${searchParams.name}` +
            `&position=${searchParams.position.id}`,
            requestOptions)
            .then(response => response.json())
            .then((data) => {
                if (selected !== undefined) {
                    setSelectedIndex(selected);
                }
                setJobOffers(data);
                if (data.length !== 0) {
                    getJobApplications(
                        pagination.page,
                        pagination.size,
                        data[selectedIndex].id
                    )
                } else setJobApplications([]);
            }).finally(setIsLoading({ ...isLoading, offers: false }));
    }

    const getJobApplications = async (page, size, offerId) => {
        setIsLoading({ ...isLoading, applications: true })
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
        };

        let requestUrl = `jobApplications?page=${page}&size=${size}&jobOffer=${offerId}`;

        await fetch(APIURL + requestUrl, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setPagination({
                    page: page,
                    size: size,
                    totalPages: data.totalPages,
                })
                setJobApplications(data.items);
            }).finally(setIsLoading({ ...isLoading, applications: false }));
    }

    const getPositions = async () => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
        };

        await fetch(APIURL + `positions`,
            requestOptions
        )
            .then(response => response.json())
            .then(data => { data.unshift(firstVal); setPositions(data) });
    }

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        getJobApplications(
            pagination.page,
            pagination.size,
            jobOffers[index].id
        )
    };

    const handleChangeSearchParams = (event) => {
        setSearchParams({
            name: event.target.name === 'name' ? event.target.value : searchParams.name,
            position: event.target.name === 'position' ? event.target.value : searchParams.position
        })
    }

    const handleSearchOffer = () => {
        getJobOffers();
    }

    const handlePageChange = (event, value) => {
        getJobApplications(value, pagination.size, jobOffers[selectedIndex]);
    };

    const handleEditJobOffer = (event, value) => {

    }

    const delDialogOpen = () => {
        setDelDialogProps({ ...delDialogProps, open: !delDialogProps.open })
    }

    const offerViewDialogOpen = () => {
        setOfferViewDialog({ ...offerViewDialog, open: !offerViewDialog.open })
    }

    const onDialogConfirm = () => {
        switch (delDialogProps.type) {
            case 'offerRemove':
                DeleteJobOffer(delDialogProps.data)
                break;
            case 'applicationRemove':
                console.log("todo");
                break;
        }
    }

    const DeleteJobOffer = (Id) => {
        const requestOptions = {
            method: 'Delete',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
        };

        fetch(APIURL + 'jobOffers/' + Id, requestOptions)
            .then((data) => {
                getJobOffers();
                setAllertProps({
                    text: "Job Offer Removed",
                    open: true,
                    type: "success"
                });
            }, (err) => {
                console.log(err)
                setAllertProps({
                    text: "Job Offer Remove Error!",
                    open: true,
                    type: "error"
                })
            });

    };

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

    const jobApplicationsSkeleton = () => {
        return (
            <List component="nav" className={classes.listComponent}>
                <div className={classes.title}>
                    <Typography variant="h6" style={{ marginLeft: '16px' }}>
                        Job Applications:
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
            <InfoDialog
                title={offerViewDialog.title}
                open={offerViewDialog.open}
                setOpen={offerViewDialogOpen}
                onConfirm={() => { }}

            >
                <JobOfferView jobOfferId={offerViewDialog.jobOfferId} />
            </InfoDialog>
            <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                <Alert onClose={handleAllertClose} severity={allertProps.type}>
                    {allertProps.text}
                </Alert>
            </Snackbar>
            <Toolbar className={classes.filterBox}>
                <h3 className={classes.whiteText}>Search Job Offer: </h3>
                <DarkTextField
                    onChange={handleChangeSearchParams}
                    label='Offer Name...'
                    name='name'
                />
                <DarkSelect
                    label="Position"
                    name="position"
                    collection={positions}
                    value={searchParams.position}
                    onChange={handleChangeSearchParams}
                />
                <Button
                    style={{ marginLeft: '15px' }}
                    variant="contained"
                    color="primary"
                    onClick={handleSearchOffer}
                >Search</Button>
            </Toolbar>

            <div className={classes.offersContainer}>
                <List component="nav" className={classes.listComponent}>
                    <div className={classes.title}>
                        <Typography variant="h6" style={{ marginLeft: '16px' }}>
                            Job Offers List:
                        </Typography>
                        <Link className={classes.linkButton} to="/main/offer-form">
                            <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                endIcon={<AddCircleIcon />}
                            >NEW Job Offer</Button>
                        </Link>
                    </div>
                    {isLoading.offers === 0 ? listSkeleton() :
                        <React.Fragment>
                            {jobOffers.length === 0 ? <p style={{ marginLeft: '12px' }}>Not Found Job Offers </p> :
                                <React.Fragment>
                                    {jobOffers.map((jobOffer, index) => (
                                        <div key={jobOffer.id}>
                                            <ListItem
                                                button
                                                selected={selectedIndex === index}
                                                onClick={(event) => handleListItemClick(event, index)}
                                            >
                                                <ListItemText
                                                    primary={'Name: ' + jobOffer.name}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textPrimary"
                                                            >
                                                                {'Position: '}
                                                            </Typography>
                                                            {jobOffer.position.name}
                                                        </React.Fragment>
                                                    }
                                                />

                                                <p style={{ marginRight: '15px' }}>{'Available Jobs: ' + jobOffer.availableJobs}</p>
                                                <ListItemSecondaryAction>
                                                    <PopupState variant="popover" popupId="team-menu">
                                                        {(popupState) => (
                                                            <React.Fragment>
                                                                <IconButton edge="end" {...bindTrigger(popupState)}>
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                                <Menu {...bindMenu(popupState)}>
                                                                    <MenuItem
                                                                        className={classes.menuItem}
                                                                        onClick={() =>
                                                                            setOfferViewDialog({
                                                                                open: true,
                                                                                title: 'Job Offer: ' + jobOffer.name,
                                                                                jobOfferId: jobOffer.id
                                                                            })
                                                                        }
                                                                    >
                                                                        <ListItemIcon>
                                                                            <VisibilityIcon fontSize="small" />
                                                                        </ListItemIcon>
                                                                        View Job Offer
                                                                    </MenuItem>
                                                                    <Link style={{ textDecoration: 'none' }} to={{ pathname: `/main/offer-form`, jobOffer: { jobOffer } }}>
                                                                        <MenuItem className={classes.menuItem} onClick={handleEditJobOffer}>
                                                                            <ListItemIcon>
                                                                                <EditIcon fontSize="small" />
                                                                            </ListItemIcon>
                                                                            Edit Job Offer
                                                                        </MenuItem>
                                                                    </Link>
                                                                    <MenuItem className={classes.menuItem} onClick={(e) =>
                                                                        setDelDialogProps({
                                                                            open: true,
                                                                            data: jobOffer.id,
                                                                            type: 'offerRemove',
                                                                            title: `Remove Job Offer : ${jobOffer.name}`,
                                                                            text: 'Are you sure you want to remove this offer?'
                                                                        })}>
                                                                        <ListItemIcon>
                                                                            <DeleteIcon fontSize="small" />
                                                                        </ListItemIcon>
                                                                        Delete Job Offer
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
                                </React.Fragment>
                            }
                        </React.Fragment>
                    }
                </List>
                {isLoading.applications ? jobApplicationsSkeleton() :
                    <List component="nav" className={classes.listComponent}>
                        <div className={classes.title}>
                            <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                Job Applications:
                            </Typography>
                        </div>
                        {jobApplications.length <= 0 ? <p style={{ marginLeft: '12px' }}>Not Found Applications </p> :
                            <React.Fragment>
                                <div style={{ overflow: 'auto', }}>
                                    {jobApplications.map((jobApplication, index) => (
                                        <div key={"member" + jobApplication.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={jobApplication.person.name + " " + jobApplication.person.surname}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textPrimary"
                                                            >
                                                                {'Application Date: '}
                                                            </Typography>
                                                            {jobApplication.applicationDate.toString().split('T')[0]}
                                                        </React.Fragment>
                                                    }
                                                />
                                                <p>Email:</p>
                                                <p style={{ marginRight: '9px', marginLeft: '5px', color: 'rgba(255, 255, 255, 0.7)' }}>{jobApplication.person.email}</p>
                                                <ListItemSecondaryAction>
                                                    <PopupState variant="popover" popupId="member-menu">
                                                        {(popupState) => (
                                                            <React.Fragment>
                                                                <IconButton edge="end" {...bindTrigger(popupState)}>
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                                <Menu {...bindMenu(popupState)}>
                                                                    <Link style={{ textDecoration: 'none' }} to={{ pathname: `/main/application/${jobApplication.id}` }}>
                                                                        <MenuItem className={classes.menuItem}>
                                                                            <ListItemIcon>
                                                                                <VisibilityIcon fontSize="small" />
                                                                            </ListItemIcon>
                                                                            Show Application
                                                                        </MenuItem>
                                                                    </Link>
                                                                    <MenuItem className={classes.menuItem} onClick={(e) =>
                                                                        setDelDialogProps({
                                                                            open: true,
                                                                            data: jobApplication.id,
                                                                            type: 'applicationRemove',
                                                                            title: `Remove Job Application: ${jobApplication.person.name} ${jobApplication.person.surname}`,
                                                                            text: 'Are you sure you want to remove this job application?'
                                                                        })}>
                                                                        <ListItemIcon>
                                                                            <DeleteIcon fontSize="small" />
                                                                        </ListItemIcon>
                                                                        Remove Application
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
                                <Pagination
                                    className={classes.pagination}
                                    count={pagination.totalPages}
                                    page={pagination.page}
                                    onChange={handlePageChange}
                                    variant="outlined"
                                />
                            </React.Fragment>
                        }
                    </List>}
            </div>
        </div>
    )
}
export default JobOffersList