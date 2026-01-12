import axios from "axios";

const API_URL = "https://library-backend-y49e.onrender.com/auth";

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