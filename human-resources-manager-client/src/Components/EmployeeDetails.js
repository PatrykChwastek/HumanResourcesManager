import React, { useEffect, useState } from "react";
import { APIURL } from './GlobalComponents';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    mainConteiner: {
        marginTop: "1.8rem",
        background: theme.palette.grey[800],
        paddingBottom: '20px',
    },
    title: {
        color: theme.palette.text.primary,
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



        color: theme.palette.text.primary,
        '& p': {
            margin: "5px",
            display: 'inline'
        },
        '& h4': {
            margin: "5px",
            display: 'inline'

        }
    },
    header: {

    },
    label: {

    },
    content: {

    },
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
        <div className={classes.mainConteiner}>
            <div className={classes.title}>
                <h3>Employee Details:</h3>
            </div>
            {employee.person === undefined ? null :
                <div className={classes.gridConteiner}>


                    <div>
                        <h3 className={classes.header}>Personsal Info</h3>
                        <div>
                            <h4>Name: </h4>
                            <p>{employee.person.name}</p>
                        </div>
                        <div >
                            <h4>Surname: </h4>
                            <p>{employee.person.surname}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className={classes.header}>Personsal Info</h3>
                        <div>
                            <h4>Name: </h4>
                            <p>{employee.person.name}</p>
                        </div>
                        <div >
                            <h4>Surname: </h4>
                            <p>{employee.person.surname}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className={classes.header}>Personsal Info</h3>
                        <div>
                            <h4>Name: </h4>
                            <p>{employee.person.name}</p>
                        </div>
                        <div >
                            <h4>Surname: </h4>
                            <p>{employee.person.surname}</p>
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}
