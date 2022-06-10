import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { DarkTextField, DarkSelect, DarkChipList } from '../GlobalComponents';
import APIURL from '../../Services/Globals'
import { authHeader } from '../../Services/AuthService'
import { useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    mainConteiner: {
        marginTop: "1.8rem",
        background: theme.palette.grey[800],
        paddingBottom: '20px'
    },
    title: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: '1px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
    },
    form: {
        display: 'grid',
        gridGap: "1.5rem",
    },
    formGrid: {
        marginTop: '1.5rem',
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        justifyContent: "space-between",
        alignContent: "space-between",
        gridGap: "1.5rem 1.5rem",
    },
    createButton: {
        margin: '0 auto',
        display: 'block',
        width: "19rem",
    }
}));
const JobOfferForm = () => {
    const classes = useStyles();
    const location = useLocation();
    const [jobOffer, setJobOffer] = useState(location.jobOffer !== undefined ? location.jobOffer.jobOffer : { id: 0, position: { id: 0 } });
    const [positions, setPositions] = useState([]);
    const [allertProps, setAllertProps] = useState({
        text: '',
        open: false,
        type: 'success'
    });


    useEffect(() => {
        getPositions()
    }, []);

    const postJobOffer = () => {
        jobOffer.position = null;
        const requestOptions = {
            method: 'Post',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
            body: JSON.stringify(jobOffer)
        };

        fetch(APIURL + `jobOffers`,
            requestOptions
        ).then(response => response.json())
            .then(() => {
                setAllertProps({
                    text: "Job Offer Created",
                    open: true,
                    type: "success"
                })
            }
                , (err) => {
                    console.log(err)
                    setAllertProps({
                        text: "Job Offer Creation Error!",
                        open: true,
                        type: "error"
                    })
                });
    }

    const putJobOffer = () => {
        const requestOptions = {
            method: 'PUT',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
            body: JSON.stringify(jobOffer),
        };
        fetch(APIURL + 'jobOffers/' + jobOffer.id, requestOptions)
            .then(() => setAllertProps({
                text: "Job Offer Modified",
                open: true,
                type: 'success'
            })
                , (err) => {
                    console.log(err)
                    setAllertProps({
                        text: "Job Offer Edit Error!",
                        open: true,
                        type: "error"
                    })
                }
            );
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
            .then(data => setPositions(data));
    }

    const headleFormChange = e => {
        setJobOffer({
            ...jobOffer,
            name: e.target.name === 'name' ? e.target.value : jobOffer.name,
            availableJobs: e.target.name === 'jobsQuantity' ? e.target.value : jobOffer.availableJobs,
            positionId: e.target.name === 'position' ? e.target.value.id : jobOffer.positionId,
            position: e.target.name === 'position' ? e.target.value : jobOffer.position,
            description: e.target.name === 'description' ? e.target.value : jobOffer.description
        })
    }

    const hendleSubmitOffer = () => {
        if (location.jobOffer !== undefined) {
            putJobOffer()
            return;
        }
        postJobOffer();
    }


    const setSelectVall = (colection, objId) => {
        if (colection[0] === undefined || objId === 0)
            return '';

        return colection[colection.findIndex((item) => item.id === objId)];
    }

    const handleAllertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAllertProps({ ...allertProps, open: false });
    };

    return (
        <div className={classes.mainConteiner}>
            <Snackbar open={allertProps.open} autoHideDuration={4000} onClose={handleAllertClose}>
                <Alert onClose={handleAllertClose} severity={allertProps.type}>
                    {allertProps.text}
                </Alert>
            </Snackbar>
            <div boxshadow={2} className={classes.title}>
                {location.jobOffer !== undefined ?
                    <h3 >{'Edit Job Offer: ' + jobOffer.id}</h3> :
                    <h3 >Create Job Offer</h3>
                }
            </div>
            <form className={classes.form} noValidate autoComplete="off">
                <div className={classes.formGrid}>
                    <DarkTextField
                        label="Name"
                        name="name"
                        value={jobOffer.name}
                        onChange={headleFormChange}
                    />
                    <DarkTextField
                        label="Available Jobs"
                        name="jobsQuantity"
                        type="number"
                        value={jobOffer.availableJobs}
                        onChange={headleFormChange}
                    />
                    <DarkSelect
                        label="Position"
                        name="position"
                        collection={positions}
                        value={setSelectVall(positions, jobOffer.position?.id) ?? ""}
                        onChange={headleFormChange}
                    />
                </div>
                <DarkTextField
                    label="Job Description..."
                    name="description"
                    maxRows={10}
                    value={jobOffer.description}
                    onChange={headleFormChange}
                />
                <Button
                    className={classes.createButton}
                    variant="contained"
                    color="primary"
                    onClick={hendleSubmitOffer}
                >Submit </Button>
            </form>
        </div>
    )
}
export default JobOfferForm