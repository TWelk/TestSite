import axios from 'axios';

// Use the REACT_APP_API_URL environment variable
const API_URL = process.env.REACT_APP_API_URL;

// Define the login function
export const login = (email, password) => {
    return axios.post(`${API_URL}/auth/login`, { email, password });
};

// Define the register function
export const register = (email, password) => {
    return axios.post(`${API_URL}/auth/register`, { email, password });
};
