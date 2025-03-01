import axios from "axios";
import { appStore } from "./src/utils/appStore";
import { addUser } from "./src/utils/userSlice";
const api = axios.create({
  baseURL: "http://localhost:7777/api/v1",
  withCredentials: true, // setCookies
  headers: { "Content-Type": "application/json" }, //This sets the request headers to tell the server that the data being sent is in JSON format.
}); // create instace of api -> config

// Response Interceptor - Handles token expiration and refresh
api.interceptors.response.use(
  (response) => response,
    async (error) => {
      
    const originalRequest = error.config;
        //console.log(error.response?.status);
    // console.log("originalRequest" + originalRequest);
    // If request fails with 401 Unauthorized, try refreshing the token
    if (error.response?.status !== 200 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
          const res = await api.get("/refreshToken");
          //console.log(res)
          console.log(res.data);
          appStore.dispatch(addUser(res.data.loggedInUser)) // store user in redux store again
        // Retry the failed request with the new access token
        //originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`; // use this if you want to store token in header
        //After successfully refreshing the access token, this line updates the request headers with the new token.
        //The Authorization header is set to "Bearer <newAccessToken>" so that the failed request can be retried with a valid token.
        return axios(originalRequest);
      } catch (error) {
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;