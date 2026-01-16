import axios from "axios";

const userApi = axios.create({
  // baseURL: "https://br6r7tz3-5000.inc1.devtunnels.ms/api",
  baseURL: "http://localhost:5000/api",
});

userApi.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return req;
});

export default userApi;
