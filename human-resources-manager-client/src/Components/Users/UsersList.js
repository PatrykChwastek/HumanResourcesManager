import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import APIURL from '../../Services/Globals';
import authHeader from '../../Services/AuthService'

const useStyles = makeStyles((theme) => ({

}));

const UsersList = () => {
    const classes = useStyles();
    const [Users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 9,
        totalPages: 1
    });

    useEffect(() => {
        getUsers(
            pagination.page,
            pagination.size
        );
    }, []);
    
    const getUsers = (page, size) => {
        const requestOptions = {
            method: 'Get',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader() }),
        };

        await fetch(APIURL + `users?page=${page}&size=${size}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setPagination({
                    page: page,
                    size: size,
                    totalPages: data.totalPages,
                })
                setUsers(data.items);
            });
    }

    return (
        <div>
        
        </div>
    )
}
export default UsersList;