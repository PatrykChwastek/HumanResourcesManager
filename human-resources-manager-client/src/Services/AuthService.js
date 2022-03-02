import APIURL from './Globals'

const login = (loginData) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    };
    return fetch(APIURL + 'users/login', requestOptions)
        .then((response) => {
            if (response.ok)
                return response.json();
            else
                return Promise.reject();
        })
        .then(data => {
            localStorage.setItem("user", JSON.stringify(data))
        })
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return 'Bearer ' + user.token;
    } else {
        return {};
    }
}

export const getUserAccess = () => {
    const permissions = getCurrentUser().userDetails.employeeDTO.permissions;
    if (permissions === undefined || permissions.length < 1) {
        return false;
    }
    const isUsserPermit = (premName) => {
        let isPermit = false;
        permissions.forEach(element => {
            if (element.name === premName) {
                isPermit = true;
                return;
            }
        });
        return isPermit;
    }

    const allowedViews = {
        humanResources: isUsserPermit("Human-Resources"),
        admin: isUsserPermit('Admin'),
        teamManager: isUsserPermit('Team-Manager')
    };

    if (allowedViews.admin) {
        allowedViews = {
            humanResources: true,
            admin: true,
            teamManager: true
        }
    }
    return allowedViews;
}

// eslint-disable-next-line
export default {
    login,
    logout,
    getCurrentUser,
    authHeader,
    getUserAccess
};