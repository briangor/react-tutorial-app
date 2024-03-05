import axios from 'axios';

export default axios.create({
    baseURL: process.env.URL || "http://localhost:8082/api/",
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
});