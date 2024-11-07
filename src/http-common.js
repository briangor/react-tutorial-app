import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export default axios.create({
    baseURL: url || "http://localhost:8082/api/",
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
});