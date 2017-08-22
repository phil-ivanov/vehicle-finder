export const REQUEST_REGISTRATION = 'REQUEST_REGISTRATION';
export const REGISTRATIONS_SUCCESS = 'REGISTRATIONS_SUCCESS';
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR';
export const USERNAME_ALREADY_USED = 'USERNAME_ALREADY_USED';
export const REGISTRATION_FETCHED = 'REGISTRATION_FETCHED';
export const FORM_CHANGED = 'FORM_CHANGED';

export const LOGIN_REQUESTED = 'LOGIN_REQUESTED';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const PASS_CHANGE_REQUEST = 'PASS_CHANGE_REQUEST';
export const PASS_CHANGE_SUCCESS = 'PASS_CHANGE_SUCCESS';
export const PASS_CHANGE_ERROR = 'PASS_CHANGE_ERROR';
export const PASS_CHANGE_FETCHING = 'PASS_CHANGE_FETCHING';

export const PROFILE_FETCH_REQUEST = 'PROFILE_FETCH_REQUEST';
export const PROFILE_FETCHED = 'PROFILE_FETCHED';
export const PROFILE_FETCH_ERROR = 'PROFILE_FETC_ERROR';

export const PROFILE_UPDATE_FETCHING = 'PROFILE_UPDATE_FETCHING';
export const PROFILE_UPDATE_SUCCESS = 'PROFILE_UPDATE_SUCCESS';
export const PROFILE_UPDATE_ERROR = 'PROFILE_UPDATE_ERROR';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';



function reqestRegistration(username, password) {
    return {
        type: REQUEST_REGISTRATION,
        payload: {username: username, password: password}
    }
}

function formChanged(payload) {
    return {
        type: FORM_CHANGED,
        payload: payload
    }
}

function registrationError(payload) {
    return {
        type: REGISTRATION_ERROR,
        payload: payload
    }
}

function registratinSuccess(user) {
    return {
        type: REGISTRATIONS_SUCCESS,
        payload: user
    }
}

function usernameTaken(payload) {
    return {
        type: USERNAME_ALREADY_USED,
        payload: payload
    }
}

function registratonFetched(payload) {
    return {
        type: REGISTRATION_FETCHED
    }
}


function loginSuccess() {
    return {
        type: LOGIN_SUCCESS
    }
}

function loginFailed(msg) {
    return {
        type: loginFailed,
        payload: {message: msg}
    }
}

function requestPasswordChangeIsFetching() {
    return {
        type: PASS_CHANGE_REQUEST
    }
}

function changePassSuccess() {
    return {
        type: PASS_CHANGE_SUCCESS
    }
}

function changePassFailed(msg) {
    return {
        type: PASS_CHANGE_ERROR,
        payload: {message: msg}
    }
}

function fetchProfile() {
    return {
        type: PROFILE_FETCH_REQUEST
    }
}

function profileGetSuccess(user) {
    return {
        type: PROFILE_FETCHED,
        payload: user
    }
}

function profileGetError(msg) {
    return {
        type: PROFILE_FETCH_ERROR,
        payload: {message: msg}
    }
}

function profileUpdateFetch() {
    return {
        type: PROFILE_UPDATE_FETCHING
    }
}

function profileUpdateSuccess() {
    return {
        type: PROFILE_UPDATE_SUCCESS
    }
}

function profileUpdateError(msg) {
    return {
        type: PROFILE_UPDATE_ERROR,
        payload: {message: msg}
    }
}

function requestPasswordChange(oldPass, newPass, newPassRepeat) {
       return dispatch => {
            dispatch(requestPasswordChangeIsFetching())
            return fetch(`http://localhost:3000/api/passwd`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    oldPassword: oldPass,
                    password: newPass,
                    passwordRepeat: newPassRepeat
                })
            })
            .then(response => {
                console.log(response);
                if(response.status !== 200) {
                    dispatch(changePassFailed("Error " + response.status))
                }
                return response.json()
            })
            .then(json => {
                console.log(json);
                if (json.success) {
                    dispatch(changePassSuccess())
                } else {
                    dispatch(changePassFailed(json.msg))
                }
            })
    }
}

function requestLogin(username, password) {
    return dispatch => {
        console.log(username + " " + password);
        return fetch(`http://localhost:3000/api/login`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({username: username, password: password})
        })
        .then(response => {
            if(response.status === 401) {
                dispatch(loginFailed())
            }
            return response.json()
        })
        .then(json => {
            console.log(json)
            if (json.success) {
                dispatch(loginSuccess())
            }
        })
    }
}


//Actions creators
function fetchRegistrationRequest(username, password) {
    return dispatch => {
        dispatch(reqestRegistration(username, password));
        return fetch(`http://localhost:3000/api/register`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({username: username, password: password, email: username})
        })
        .then(response => {
            dispatch(registratonFetched()) 
            return response.json()
        })
        .then(json => {
            console.log(json);
            if(json.success) {
                dispatch(registratinSuccess())
                debugger
                dispatch(requestLogin(username, password))
            }
            if(json.msg && json.msg.indexOf('already exists') > 0) {
                console.log('Username exists');
                dispatch(usernameTaken(true));
            }
        })
    }
}

function getUserProfile() {
    return dispatch => {
        dispatch(fetchProfile());
        return fetch(`http://localhost:3000/api/profile`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => {
            return response.json()
        })
        .then(json => {
            console.log(json);
            if(json.msg) {
                console.log(json.msg)
                dispatch(profileGetError(json.msg));
            } else {
                dispatch(profileGetSuccess(json.user))
            }
        })
    }
}

function postUserProfile(username, email, firstName, lastName) {
    return dispatch => {
        dispatch(profileUpdateFetch());
        return fetch(`http://localhost:3000/api/profile`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName
            })
        })
        .then(response => {
            if(response.status === 200) {
                dispatch(profileUpdateSuccess())
            }
            return response.json()
        })
        .then(json => {
            console.log(json);
            if(json.msg) {
                dispatch(profileUpdateError(json.msg));
            }
        })
    }
}

function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        payload: {user: user}
    }
}

export {fetchRegistrationRequest, formChanged, requestLogin,
        requestPasswordChange, getUserProfile, postUserProfile,
        setCurrentUser}