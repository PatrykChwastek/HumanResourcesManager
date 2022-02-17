import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import TasksList from "../Tasks/TasksList";

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
    gridConteiner: {
        display: "grid",
        gridTemplateColumns: `1fr 1fr 1fr`,
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
    permitionChip: {
        margin: "2px",
        marginLeft: "5px",
        boxShadow: theme.shadows[2],
        fontSize: "14px",
        fontWeight: "501"

    }
}));

export const EmployeeDetails = () => {
    const classes = useStyles();
    const [employee, setEmployee] = useState({});
    const params = useParams();



    useEffect(() => {
        getEmploee(params.id);
    }, [])

    const getEmploee = async (empID) => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        await fetch(APIURL + `employee/get/` + empID,
            requestOptions
        )
            .then(response => response.json())
            .then(data => setEmployee(data));
    }

    return (
        <div>
            <div className={classes.detailsConteiner}>
                <div className={classes.title}>
                    <h2>Employee Details:</h2>
                </div>
                {employee.person === undefined ? null :
                    <div className={classes.gridConteiner}>
                        <div>
                            <h2 className={classes.header}>Personsal Info</h2>
                            <div>
                                <h3>Name: </h3>
                                <p>{employee.person.name}</p>
                            </div>
                            <div  >
                                <h3>Surname: </h3>
                                <p>{employee.person.surname}</p>
                            </div>
                            <div  >
                                <h3>Phone Number: </h3>
                                <p>{employee.person.phoneNumber}</p>
                            </div>
                            <div  >
                                <h3>Email: </h3>
                                <p>{employee.person.email}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className={classes.header}>Address:</h2>
                            <div  >
                                <h3>City: </h3>
                                <p>{employee.person.employeeAddress.city}</p>
                            </div>
                            <div   >
                                <h3>Street: </h3>
                                <p>{employee.person.employeeAddress.street}</p>
                            </div>
                            <div  >
                                <h3>Post Code: </h3>
                                <p>{employee.person.employeeAddress.postCode}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className={classes.header}>Occupation info</h2>
                            <div  >
                                <h3>Employment Date: </h3>
                                <p>{employee.employmentDate.toString().split('T')[0]}</p>
                            </div>
                            <div  >
                                <h3>Position: </h3>
                                <p>{employee.position.name}</p>
                            </div>
                            <div  >
                                <h3>Seniority Lvl: </h3>
                                <p>{employee.seniority}</p>
                            </div>
                            <div  >
                                <h3>Department: </h3>
                                <p>{employee.department.name}</p>
                            </div>
                            <div  >
                                <h3>Work Type: </h3>
                                <p>{employee.remoteWork === true ? "Remote" : "Office"}</p>
                            </div>
                        </div>

                    </div>
                }
                {employee.permissions === undefined ||
                    employee.permissions.length === 0 ? null :
                    <div>
                        <h2>Employee Permissions: </h2>
                        {employee.permissions.map((permition, index) => (
                            <Chip
                                className={classes.permitionChip}
                                key={index}
                                label={permition.name}
                                color="primary"
                            />

                        ))}
                    </div>
                }
            </div>

            <TasksList userId={params.id} type='view' />
        </div>
    )
}
