import React, { useEffect, useState } from "react";
import APIURL, { ClientURL } from '../../Services/Globals'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { authHeader } from '../../Services/AuthService'

import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles((theme) => ({
    detailsConteiner: {
        background: theme.palette.grey[800],
        color: theme.palette.text.primary,
    },
    gridConteiner: {
        display: "grid",
        gridTemplateColumns: `1fr 1fr`,
        gridTemplateRows: "1fr ",
        justifyContent: "space-evenly",
        gridGap: '8px',
        alignContent: "center",
        marginTop: "5px",
        '& p': {
            margin: "5px",
            display: 'inline',
            fontSize: "17px"
        },
        '& h3': {
            margin: "5px",
            display: 'inline',
        }
    },
    description: {
        display: "flex",
        flexDirection: "column"
    },
    JobApplicationLink: {
        padding: "6px",
        margin: "5px",
        width: '99%',
        backgroundColor: theme.palette.grey[200],
        borderRadius: '4px',
        boxShadow: theme.shadows[3],
        "& a": {
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: '15px'
        }
    }
}));

const JobOfferView = (jobOfferId) => {
    const classes = useStyles();
    const [jobOffer, setJobOffer] = useState({});
    const params = useParams();

    useEffect(() => {
        getJobOffer(params.id === undefined ? jobOfferId.jobOfferId : params.id);
    }, [])

    const getJobOffer = async (id) => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
        };
        await fetch(APIURL + `jobOffers/` + id,
            requestOptions
        )
            .then(response => response.json())
            .then(data => setJobOffer(data));
    }

    const CopyLink = () => {
        navigator.clipboard.writeText(ClientURL + 'submit-application/' + jobOffer.id)
    }

    return (
        <div>
            <div className={classes.detailsConteiner}>
                {jobOffer.position === undefined ? null :
                    <React.Fragment>
                        <div className={classes.gridConteiner}>
                            <div  >
                                <h3>Available Jobs: </h3>
                                <p>{jobOffer.availableJobs}</p>
                            </div>
                            <div  >
                                <h3>Position: </h3>
                                <p>{jobOffer.position.name}</p>
                            </div>
                            <div className={classes.description}>
                                <h3>Description: </h3>
                                <p>{jobOffer.description}</p>
                            </div>
                        </div>
                        <h3 style={{ margin: '5px' }}>Submit to this offer : </h3>
                        <div style={{ display: 'flex' }}>
                            <div className={classes.JobApplicationLink}>
                                <a href={ClientURL + 'submit-application/' + jobOffer.id} target="_blank">
                                    {ClientURL + 'submit-application/' + jobOffer.id}
                                </a>
                            </div>
                            <Button
                                style={{ margin: '5px' }}
                                variant="contained"
                                onClick={CopyLink()}
                                color="secondary"
                            >
                                <FileCopyIcon />
                            </Button>
                        </div>
                    </React.Fragment>
                }
            </div>
        </div>
    )
}
export default JobOfferView