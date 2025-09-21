//? Configuring axios  ( Axios gives some method to config so it might be hard to understand but i have mentioned a with fetch that is understandble same logic is shown ower here ) 

import axios from "axios";
import appStore from "../store/appStore";
import { logout } from "../store/common/userSlice";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";


// Create axios instance
const axiosInstance = axios.create(
  { // defined repeted option 
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  }
);


// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === HttpStatusCode.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      // console.log("enteredd here here here")
      try {
        // Call refresh token endpoint
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {}, {
          withCredentials : true
        });

        if (response.status === HttpStatusCode.OK) {
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        appStore.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    // For any other error, just reject
    return Promise.reject(error);
  }
);

export default axiosInstance; 



//? if you are using fetch this is how you can do and this is understandable 
/*  Create a custom fetch function with refresh token handling

const customFetch = async (url: string, options: RequestInit = {}) => {
    // First attempt
    let response = await fetch(url, {
        ...options, // your fetch request options come here and merge  (still doubt i have show bellow what option look like)
        credentials: 'include', // This is equivalent to withCredentials: true in axios
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });



    // If response is 401 (Unauthorized), try to refresh token
    if (response.status === 401 ) { // aslo you can check with message send from bakcend like  msg : token expired  true or false
        try {
            // Call refresh token endpoint
            const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (refreshResponse.ok) {
                // Retry the original request
                response = await fetch(url, {
                    ...options,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers,
                    },
                });
            } else {
                // If refresh fails, logout user
                appStore.dispatch(logout());
                toast.error('Session expired. Please login again.');
                throw new Error('Session expired');
            }
        } catch (error) {
            appStore.dispatch(logout());
            toast.error('Session expired. Please login again.');
            throw error;
        }
    }

    return response;
};

// Now instaed of using fetch now jst user customFetch 
// Example usage in your services:
     const response = await customFetch(`http://localhost:5000/api/auth/signup`,
        { method: 'POST', body: JSON.stringify(data),  });  //# this line is passed as option  and get spread and concate with the existing config 
}

export default new AuthService();

*/