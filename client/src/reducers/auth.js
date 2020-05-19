import {
    REGISTER_SUCCESS,
    CLEAR_PROFILE,
    REGISTER_FAIL, LOGOUT, USER_LOADED, AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS
} from '../actions/types'
const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null
}


export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
            return { ...state, ...payload, isAuthenticated: true, loading: false };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
            localStorage.removeItem('token')
            return { ...state, token: null, isAuthenticated: false, loading: false };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repo: [],
                loading: false
            }
        case USER_LOADED:
            return { ...state, isAuthenticated: true, loading: false, user: payload }
        default:
            return state
    }
}