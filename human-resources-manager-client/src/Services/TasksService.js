import APIURL from './Globals'

export const getTasks = async (page, size, employeeid, taskName, status, bStartTime, aStartTime, bDeadline, aDeadline) => {
    let getTasksUrl = `tasks?page=${page}&size=${size}&employeeid=${employeeid}`;

    if (taskName !== undefined) {
        if (taskName !== '')
            getTasksUrl += `&name=${taskName}`
    }

    if (status !== undefined) {
        getTasksUrl += `&status=${status}`
    }

    if (bStartTime !== undefined) {
        getTasksUrl += `&b_start_time=${bStartTime}`
    };

    if (aStartTime !== undefined) {
        getTasksUrl += `&a_start_time=${aStartTime}`
    };

    if (bDeadline !== undefined) {
        getTasksUrl += `&b_deadline=${bDeadline}`
    };

    if (aDeadline !== undefined) {
        getTasksUrl += `&a_deadline=${aDeadline}`
    };

    const requestOptions = {
        method: 'Get',
        headers: { 'Content-Type': 'application/json' }
    };

    return await fetch(APIURL + getTasksUrl,
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