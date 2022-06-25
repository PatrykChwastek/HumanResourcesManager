import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { authHeader } from '../../Services/AuthService'
import Button from '@material-ui/core/Button';
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { InfoDialog } from '../GlobalComponents';

import GetAppIcon from '@material-ui/icons/GetApp';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => ({
    detailsConteiner: {
        margin: "8px",
        background: theme.palette.grey[800],
        padding: '1.5rem',
        color: theme.palette.text.primary,
    },
    title: {
        margin: "-1.5rem",
        textAlign: 'center',
        padding: '1px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
    },
    conteiner: {
        display: "grid",
        gridTemplateColumns: 'repeat(auto-fit, minmax(602px, 1fr))',
        gridTemplateRows: "1fr ",
        justifyContent: "space-evenly",
        alignContent: "center",
        marginTop: "0.5rem",
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
    gridConteiner: {
        display: "grid",
        gridTemplateColumns: `1fr 1fr`,
        gridTemplateRows: "1fr ",
        justifyContent: "space-evenly",
        alignContent: "center",
        gridGap: "8px",
        marginTop: "0.5rem",
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
    cvBtnContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    cvVievBtn: {
        width: '62px',
        marginLeft: '12px'
    },
    downloadBtn: {
        width: ''
    }
}));

const JobApplicationView = () => {
    const classes = useStyles();
    const [application, setApplication] = useState({});
    const [PDF, setPDF] = useState();
    const params = useParams();
    const [pdfOpen, setSetPdfOpen] = useState(false);

    useEffect(() => {
        getApplication(params.id);
    }, [])

    const getApplication = async (ID) => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
        };
        await fetch(APIURL + `JobApplications/` + ID,
            requestOptions
        )
            .then(response => response.json())
            .then(data => setApplication(data));

        await fetch(APIURL + `JobApplications/cv/` + ID,
            requestOptions
        )
            .then(res => res.blob().then(data => setPDF(data)));
    }

    const pdfDialogTogle = () => {
        setSetPdfOpen(!pdfOpen);
    }

    return (
        <div className={classes.conteiner}>
            <InfoDialog
                title=''
                open={pdfOpen}
                setOpen={pdfDialogTogle}
                secondAction={<Button onClick={() => console.log("download")} variant="contained" color="primary"><GetAppIcon /></Button>}
                onConfirm={() => { }}

            >
                <Document file={PDF}>
                    <Page pageNumber={1} />
                </Document>
            </InfoDialog>
            <div className={classes.detailsConteiner}>
                <div className={classes.title}>
                    <h2>Candidate Info</h2>
                </div>
                {application.person === undefined ? null :
                    <div className={classes.gridConteiner}>
                        <div>
                            <h2 className={classes.header}>Personsal Info:</h2>
                            <div>
                                <h3>Name: </h3>
                                <p>{application.person.name}</p>
                            </div>
                            <div  >
                                <h3>Surname: </h3>
                                <p>{application.person.surname}</p>
                            </div>
                            <div  >
                                <h3>Phone Number: </h3>
                                <p>{application.person.phoneNumber}</p>
                            </div>
                            <div  >
                                <h3>Email: </h3>
                                <p>{application.person.email}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className={classes.header}>Candidate Address:</h2>
                            <div  >
                                <h3>City: </h3>
                                <p>{application.person.employeeAddress.city}</p>
                            </div>
                            <div   >
                                <h3>Street: </h3>
                                <p>{application.person.employeeAddress.street}</p>
                            </div>
                            <div  >
                                <h3>Post Code: </h3>
                                <p>{application.person.employeeAddress.postCode}</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className={classes.detailsConteiner}>
                <div className={classes.title}>
                    <h2>Job Application Details:</h2>
                </div>
                {application.person === undefined ? null :
                    <React.Fragment>
                        <div className={classes.gridConteiner}>
                            <div>
                                <h2 className={classes.header}>Application Info</h2>
                                <div  >
                                    <h3>Application Date: </h3>
                                    <p>{application.applicationDate.toString().split('T')[0]}</p>
                                </div>
                                <div  >
                                    <h3>Position: </h3>
                                    <p>{application.position.name}</p>
                                </div>
                                <div  >
                                    <h3>Expected Salary: </h3>
                                    <p>{application.ExpectedSalary}</p>
                                </div>
                            </div>
                            <div className={classes.cvBtnContainer}>
                                <h2 className={classes.header}>Show CV:</h2>
                                <Button onClick={() => setSetPdfOpen(true)} className={classes.cvVievBtn} variant="contained" color="primary">
                                    <DescriptionIcon style={{ fontSize: 52 }} />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h2 className={classes.header}>Application Content:</h2>
                            <div>
                                <p>{application.Content}</p>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </div>
        </div>

    );
}
export default JobApplicationView;