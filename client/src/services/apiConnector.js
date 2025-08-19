 import axios from "axios";

 export const axiosInstance = axios.create({});

 export const apiConnector = (method, url, bodyData, headers, params) => {
    // GEt token from localStorage
    const token = JSON.parse(localStorage.getItem("token"));

    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers:{
            Authorization: token ? `Bearer ${token}` : undefined,
        },
        params:params ? params : null,
    })
 }
 
 