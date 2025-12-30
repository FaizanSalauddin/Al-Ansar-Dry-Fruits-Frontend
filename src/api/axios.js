import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((req) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (adminInfo?.token) {
    req.headers.Authorization = `Bearer ${adminInfo.token}`;
  } else if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return req;
});

export default api;