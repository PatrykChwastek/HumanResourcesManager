import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { authHeader } from '../../Services/AuthService'

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
    }
}));

const JobOfferView = (jobOfferId) => {
    const classes = useStyles();
    const [jobOffer, setJobOffer] = useState({});
    const params = useParams();

    useEffect(() => {
        getJobOffer(params.id === undefined ? jobOfferId.jobOfferId : params.id);
    })

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
    return (
        <div>
            <div className={classes.detailsConteiner}>
                {jobOffer.position === undefined ? null :
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
                }
            </div>
        </div>
    )
}
export default JobOfferView