import axios from "axios";

const API_URL = "http://localhost:8080/auth";

const register = (userData) => {
    // Sends { username, email, password } to the backend
    return axios.post(`${API_URL}/register`, userData);
};

const login = (userData) => {
    // Sends { username, password }
    return axios.post(`${API_URL}/login`, userData);
};

export default {
    register,
    login,
};