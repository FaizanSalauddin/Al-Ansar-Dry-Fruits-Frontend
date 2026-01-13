import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

adminApi.interceptors.request.use((req) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  if (adminInfo?.token) {
    req.headers.Authorization = `Bearer ${adminInfo.token}`;
  }

  return req;
});

export default adminApi;
