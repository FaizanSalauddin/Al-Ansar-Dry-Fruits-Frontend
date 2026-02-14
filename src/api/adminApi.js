import axios from "axios";

const adminApi = axios.create({
  // baseURL: "https://br6r7tz3-5000.inc1.devtunnels.ms//api",
  baseURL: "https://al-ansar-dry-fruits-backend.onrender.com/api",
});

adminApi.interceptors.request.use((req) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  if (adminInfo?.token) {
    req.headers.Authorization = `Bearer ${adminInfo.token}`;
  }

  return req;
});

export default adminApi;
