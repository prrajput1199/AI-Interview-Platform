import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type':'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        //add later any request modifications here
        return config;
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
         //Handle unAuthorized access
         window.location.href = '/login';
        }

        return Promise.reject(error)
    }
)

export default axiosInstance;