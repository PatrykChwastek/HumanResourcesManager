import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals'
import { makeStyles } from '@material-ui/core/styles';
import { authHeader } from '../../Services/AuthService'
import { useParams } from "react-router-dom";
import { DarkTextField, DarkSelect } from '../GlobalComponents';
import { format } from 'date-fns'

import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    conteiner: {
        width: '55%',
        margin: "20px auto",
        background: theme.palette.grey[800],
        padding: '1.5rem',
        color: theme.palette.text.primary,
        '& h3': {
            margin: "5px",
            display: 'inline',
        }
    },
    title: {
        margin: "-1.5rem",
        textAlign: 'center',
        padding: '1px',
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
    },
    content: {
        marginTop: "2rem",
        marginBottom: "1rem",
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
    },
    textBox: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px"
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        justifyContent: "space-between",
        alignContent: "space-between",
        gridGap: "1.2rem 1.2rem",
        marginBottom: '1.2rem'
    },
    resume: {
        display: "flex",
        flexDirection: "column",
        margin: '5px',
        marginBottom: '2rem',
        '& p': {
            display: 'inline',
            marginLeft: '5px'
        }
    },
    submitButton: {
        marginLeft: '5px',
        width: '100px'
    }
}));

const CreateJobApplication = () => {
    const params = useParams();
    const classes = useStyles();
    const [jobOffer, setJobOffer] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [jobApplication, setJobApplication] = useState({
        applicationDate: format(new Date(), "yyy-MM-dd"),
        position: {},
        expectedSalary: 0,
        jobOfferId: 0,
        content: '',
        person: {
            id: 0,
            name: "",
            surname: "",
            phoneNumber: "",
            email: "",
            employeeAddress: {
                id: 0,
                city: "",
                postCode: "",
                street: ""
            }
        },
        CVFile: null
    })

    useEffect(() => {
        getJobOffer(params.id);
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

    const PostJobApplication = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "id": 0, "name": "Json", "surname": "j",
                "phoneNumber": 0, "email": "temp@mail.net",
                "EmployeeAddressId": 0,
                "employeeAddress":
                    { "id": 0, "city": "New York", "postCode": "11-111", "street": "str 11" }
            })
        };
        fetch(APIURL + 'JobApplications', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const headleFormChange = e => {
        setJobApplication({
            ...jobApplication,
            expectedSalary: e.target.name === 'expectedSalary' ? e.target.value : jobApplication.expectedSalary,
            content: e.target.name === 'content' ? e.target.value : jobApplication.content,
            person: {
                ...jobApplication.person,
                name: e.target.name === "name" ? e.target.value : jobApplication.person.name,
                surname: e.target.name === "surname" ? e.target.value : jobApplication.person.surname,
                phoneNumber: e.target.name === "phone" ? e.target.value : jobApplication.person.phoneNumber,
                email: e.target.name === "email" ? e.target.value : jobApplication.person.email,
                employeeAddress: {
                    ...jobApplication.person.employeeAddress,
                    city: e.target.name === "city" ? e.target.value : jobApplication.person.employeeAddress.city,
                    postCode: e.target.name === "postCode" ? e.target.value : jobApplication.person.employeeAddress.postCode,
                    street: e.target.name === "street" ? e.target.value : jobApplication.person.employeeAddress.street
                }
            }
        })
    }

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };
    //change to jobApplication state(add to form data)
    const handleSubmission = () => {
        const formData = new FormData();

        formData.append('Id', 0);
        formData.append('Name', "Json");
        formData.append('Surname', "xy");
        formData.append('Email', "e3@gr");
        formData.append('Content', "bzdury");
        formData.append('PositionId', 1);
        formData.append('ApplicationDate', "2021-02-01");
        formData.append('CVPath', "");
        formData.append('CVFile', selectedFile);

        fetch(
            'http://localhost:5000/api/JobApplications',
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <div className={classes.conteiner}>
                {jobOffer === undefined ? null :
                    <React.Fragment>
                        <div className={classes.title}>
                            <h2>Job Offer: {jobOffer.name}</h2>
                        </div>
                        <div className={classes.content}>
                            <div className={classes.gridConteiner}>
                                <div  >
                                    <h3>Position: </h3>
                                    <p>{jobOffer.position.name}</p>
                                </div>
                                <div  >
                                    <h3>Available Jobs: </h3>
                                    <p>{jobOffer.availableJobs}</p>
                                </div>
                                <div className={classes.textBox}>
                                    <h3>Job Description: </h3>
                                    <p>{jobOffer.description}</p>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                <form className={classes.form} noValidate autoComplete="off">
                    <div className={classes.formGrid}>
                        <DarkTextField
                            label="Name"
                            name="name"
                            value={jobApplication.person.name}
                            onChange={headleFormChange}
                        />
                        <DarkTextField
                            label="Surname"
                            name="surname"
                            value={jobApplication.person.surname}
                            onChange={headleFormChange}
                        />
                        <DarkTextField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={jobApplication.person.phoneNumber}
                            onChange={headleFormChange}
                        />
                        <DarkTextField
                            label="Email"
                            name="email"
                            value={jobApplication.person.email}
                            onChange={headleFormChange}
                        />
                        <DarkTextField
                            label="City"
                            name="city"
                            value={jobApplication.person.employeeAddress.city}
                            onChange={headleFormChange}
                        />
                        <DarkTextField
                            label="Post Code"
                            name="postCode"
                            value={jobApplication.person.employeeAddress.postCode}
                            onChange={headleFormChange}
                        />
                        <DarkTextField
                            label="Street"
                            name="street"
                            value={jobApplication.person.employeeAddress.street}
                            onChange={headleFormChange}
                        />

                    </div>
                    <div className={classes.textBox}>
                        <DarkTextField
                            label="Tell us about yourself..."
                            name="content"
                            maxRows={10}
                            value={jobApplication.person.content}
                            onChange={headleFormChange}
                        />
                    </div>
                    <div className={classes.resume}>
                        <h3>Resume: </h3>
                        <div>
                            <Button
                                variant="contained"
                                color={isSelected ? "secondary" : "primary"}
                                component="label"
                            >
                                Upload Resume
                                <input
                                    className={classes.upload}
                                    type="file"
                                    name="file"
                                    onChange={changeHandler}
                                    hidden
                                />
                            </Button>
                            <p>{isSelected ? selectedFile.name : 'No file selected'}</p>
                        </div>
                    </div>
                    <Button
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        onClick={handleSubmission}
                    >Apply </Button>
                </form>
            </div>
            <div>
            </div>
        </div>
    );
}
export default CreateJobApplication;