import React, { useEffect, useState } from "react";
import APIURL from '../../Services/Globals';
import { getCurrentUser, authHeader } from '../../Services/AuthService';
import TasksList from "../Tasks/TasksList";

const TeamTasks = () => {
    const leaderID = getCurrentUser().userDetails.employeeDTO.id;
    const [team, setTeam] = useState({});

    useEffect(() => {
        getTeam();
    }, []);

    const getTeam = () => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() })
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