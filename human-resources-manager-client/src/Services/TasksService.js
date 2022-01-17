import APIURL from './Globals'

export const getTasks = async (page, size, employeeid, bStartTime, aStartTime) => {
    const requestOptions = {
        method: 'Get',
        headers: { 'Content-Type': 'application/json' }
    };
    return await fetch(APIURL +
        `tasks?page=${page}&size=${size}&employeeid=${employeeid}&b_start_time=${bStartTime}&a_start_time=${aStartTime}`,
        requestOptions
    ).then((response) => {
        if (response.ok)
            return response.json();
        else
            return Promise.reject();
    })
        .then(data => {
            return data
        })
}

export const changeTaskStatus = async (taskID, status) => {
    const requestOptions = {
        method: 'Put',
        headers: { 'Content-Type': 'application/json' }
    };
    return await fetch(APIURL +
        `tasks?id=${taskID}&status=${status}`,
        requestOptions
    ).then((response) => {
        if (response.ok)
            return response.json();
        else
            return Promise.reject();
    })
        .then(data => {
            return data
        })
}

// eslint-disable-next-line
export default {
    getTasks,
    changeTaskStatus
};