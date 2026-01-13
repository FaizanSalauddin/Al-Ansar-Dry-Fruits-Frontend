import axios from "axios";

const userApi = axios.create({
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
