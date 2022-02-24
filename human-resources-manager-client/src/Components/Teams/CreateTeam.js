import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect, DarkChipList } from '../GlobalComponents';
import APIURL from '../../Services/Globals';
import AddTeamMembers from './AddTeamMembers';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.primary,
        paddingLeft: '18px',
        "& h3": {
            margin: '6px 18px 0 0',
        },
        "& h4": {
            margin: '0px',
            marginRight: '18px',
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
    steper: {
        padding: '8px',
        margin: '12px 0'
    },
    stepButtons: {
        display: 'flex',

        "& Button": {
            width: '120px',
            margin: '4px 8px'
        }
    },
    stepContent: {
        padding: '0'
    }
}));

const CreateTeam = () => {
    const classes = useStyles();
    const [team, setTeam] = useState({ name: '', members: [] });
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Select Team Leader', 'Select Team Members', 'Final'];


    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <AddTeamMembers
                        isSingle={true}
                        selected={team.teamLeader}
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
            <div className={classes.box} style={{ marginTop: '1rem' }}>
                <div className={classes.title}>
                    <h3 >{'Team Name:  '}<span>{team.name}</span> </h3>
                    <h3 >{'Team Members: '}<span>{team.members.length}</span> </h3>
                </div>
                <div className={classes.title} >
                    <h3 >{'Team Leader:  '}</h3>
                    {team.teamLeader.person === undefined ? null :
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginRight: '8px' }}>
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
                <Divider variant="inset" style={{ width: "100%", margin: "8px 0" }} />
                <Button
                    style={{ margin: '8px auto', width: '20%' }}
                    onClick={handleCreateTeam}
                    variant="contained"
                    color="primary"
                >
                    Create Team
                </Button>
            </div>
        );
    };

    const handleCreateTeam = async () => {
        const requestOptions = {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(team)
        };
        await fetch(APIURL + `teams`, requestOptions).then(data => {
            console.log(data);
        }, (err) => {
            console.log(err)
        });
    }

    const handleNext = () => {
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

    return (
        <div>
            <div className={classes.mainConteiner}>

                <div className={classes.box}>
                    <div className={classes.title}>
                        <h3 >Create New Team</h3>
                    </div>
                    <DarkTextField
                        label="Team Name"
                        name="teamName"
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
                            {activeStep !== steps.length - 1 ? 'Next' : 'Finish'}
                        </Button>
                    </div>

                </div>
                <div className={classes.stepContent}>
                    {getStepContent(activeStep)}
                </div>

            </div>
        </div>
    )
}
export default CreateTeam;
