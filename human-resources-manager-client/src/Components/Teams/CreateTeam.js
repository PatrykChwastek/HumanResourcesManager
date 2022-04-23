import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField } from '../GlobalComponents';
import { useLocation } from "react-router-dom";
import APIURL from '../../Services/Globals';
import { authHeader } from '../../Services/AuthService'
import AddTeamMembers from './AddTeamMembers';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.primary,
        paddingLeft: '18px',
        "& h2": {
            margin: '2px',
            marginRight: '18px',
        },
        "& h3": {
            margin: '6px 18px 2px 0',
        },
        "& h4": {
            margin: '2px',
            marginLeft: '8px',
        },
        "& span": {
            color: theme.palette.text.secondary
        }
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.grey[800],
        padding: '8px',
        boxShadow: theme.shadows[2],
        borderRadius: '4px'
    },
    prevBox: {
        display: 'flex',
        flexDirection: 'row',
    },
    steper: {
        padding: '8px',
        margin: '12px 0'
    },
    stepButtons: {
        display: 'flex',

        "& Button": {
            width: '135px',
            margin: '4px 8px'
        }
    },
    stepContent: {
        padding: '0'
    },
    listComponent: {
        marginLeft: '8px',
        width: '99%',
        minHeight: '400px',
        maxHeight: '600px',
        paddingTop: 0,
        backgroundColor: theme.palette.background.paper,
        color: 'white',
        boxShadow: theme.shadows[2],
        borderRadius: '4px',
        display: "flex",
        flexDirection: 'column'
    },
    prevTitle: {
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
    menuItem: {
        textDecoration: "none",
        color: "white",
        "& .MuiListItemIcon-root": {
            minWidth: '32px'
        }
    }
}));

const CreateTeam = () => {
    const classes = useStyles();
    const location = useLocation();
    const [team, setTeam] = useState(
        location.team !== undefined ?
            location.team :
            { name: '', members: [] }
    );
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Select Team Leader', 'Select Team Members', 'Final'];
    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
    });

    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <AddTeamMembers
                        isSingle={true}
                        selected={[team.teamLeader]}
                        onSelectionConfirm={onTeamLeaderSelected}
                    />);
            case 1:
                return (<div>
                    <AddTeamMembers
                        selected={team.members}
                        onSelectionConfirm={onTeamMembersSelected}
                    /></div>);
            case 2:
                return (TeamPreview());
        }
    }

    const TeamPreview = () => {
        return (
            <div style={{ marginTop: '1rem' }}>
                <div className={classes.prevBox}>
                    <div className={classes.box} style={{ padding: '0', minWidth: '300px' }}>
                        <div className={classes.prevTitle}>
                            <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                Team Preview:
                            </Typography>
                        </div>
                        <div className={classes.title}>
                            <h3 >{'Team Name:  '}<span>{team.name}</span> </h3>
                            <h3 >{'Team Members: '}<span>{team.members.length}</span> </h3>
                        </div>
                        <div className={classes.title} >
                            <h3>{'Team Leader:  '}</h3>
                            {team.teamLeader.person === undefined ? null :
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '8px' }}>
                                    <h4 >{'Name: '}
                                        <span>
                                            {`${team.teamLeader.person.name} ` +
                                                `${team.teamLeader.person.surname}`}
                                        </span>
                                    </h4>
                                    <h4>{'Position: '}
                                        <span>
                                            {`${team.teamLeader.seniority} ` +
                                                `${team.teamLeader.position.name}`}
                                        </span>
                                    </h4>
                                    <h4>{'Department: '}
                                        <span>
                                            {`${team.teamLeader.department.name}`}
                                        </span>
                                    </h4>
                                    <h4 >{'Email: '}
                                        <span>
                                            {`${team.teamLeader.person.email}`}
                                        </span>
                                    </h4>
                                    <h4>{'Phone: '}
                                        <span>
                                            {`${team.teamLeader.person.phoneNumber}`}
                                        </span>
                                    </h4>
                                </div>
                            }
                        </div>
                    </div>
                    {team.members.length === 0 ? null :
                        <List component="nav" className={classes.listComponent}>
                            <div className={classes.prevTitle}>
                                <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                    Team Members:
                                </Typography>
                            </div>
                            {team.members.length <= 0 ? <p style={{ marginLeft: '12px' }}>No Members</p> :
                                <div style={{ overflow: 'auto', }}>
                                    {team.members.map((member, index) => (
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
                                            </ListItem>
                                            <Divider variant="inset" style={{ width: "100%", margin: "0" }} />
                                        </div>
                                    ))}
                                </div>
                            }
                        </List>}
                </div>
            </div>
        );
    };

    const PostTeam = async () => {
        const requestOptions = {
            method: 'Post',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
            body: JSON.stringify(team)
        };
        await fetch(APIURL + `teams`, requestOptions).then(data => {
            setAllertProps({
                text: "Team Created",
                open: true,
                type: "success"
            });
        }, (err) => {
            console.log(err);
            setAllertProps({
                text: "Team Creation Error!",
                open: true,
                type: "error"
            });
        });
    }

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            PostTeam();
        }
        setActiveStep((prevActiveStep) =>
            activeStep !== steps.length - 1 ? prevActiveStep + 1 :
                steps.length - 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const onTeamLeaderSelected = (leader) => {
        setTeam({ ...team, teamLeader: leader[0] })
    }
    const onTeamMembersSelected = (members) => {
        setTeam({ ...team, members: members })
    }

    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    return (
        <React.Fragment>
            <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                <Alert onClose={handleAllertClose} severity={allertProps.type}>
                    {allertProps.text}
                </Alert>
            </Snackbar>
            <div className={classes.mainConteiner}>
                <div className={classes.box}>
                    <div className={classes.title}>
                        <h3 >Create New Team</h3>
                    </div>
                    <DarkTextField
                        label="Team Name"
                        name="teamName"
                        defaultValue={team.name}
                        onChange={(e) => { setTeam({ ...team, name: e.target.value }) }}
                    />
                    <Stepper className={classes.steper} activeStep={activeStep}>
                        {steps.map((label, index) =>

                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        )}
                    </Stepper>
                    <div className={classes.stepButtons}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            variant="contained"
                            color="primary"
                        >
                            Back
                        </Button>
                        <Button
                            disabled={
                                activeStep === 0 && team.teamLeader === undefined ? true :
                                    activeStep === 1 && team.members.length <= 0 ? true : false
                            }
                            onClick={handleNext}
                            variant="contained"
                            color="primary"
                        >
                            {activeStep !== steps.length - 1 ? 'Next' : 'Create Team'}
                        </Button>
                    </div>
                </div>
                <div className={classes.stepContent}>
                    {getStepContent(activeStep)}
                </div>

            </div>
        </React.Fragment>
    )
}
export default CreateTeam;
