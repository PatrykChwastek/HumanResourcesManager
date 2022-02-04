import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import APIURL from '../../Services/Globals';
import { getTasks, changeTaskStatus } from "../../Services/TasksService";
import { getCurrentUser } from '../../Services/AuthService';
import TasksList from "../Tasks/TasksList";

const useStyles = makeStyles((theme) => ({

}));

const leaderID = getCurrentUser().userDetails.employeeDTO.id;
const TeamTasks = () => {
    const classes = useStyles();
    const [team, setTeam] = useState({});

    useEffect(() => {
        getTeam();
    }, []);

    const getTeam = () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(APIURL + `teams/leader/${leaderID}`, requestOptions)
            .then(response => response.json())
            .then(data => (
                setTeam(data)
            ));
    }

    return (
        <div>
            {team.id === undefined ? null :
                <TasksList teamId={team.id} />
            }
        </div>
    );
}
export default TeamTasks;