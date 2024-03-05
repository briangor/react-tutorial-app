import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8082/api/",
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
});