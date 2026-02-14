import axios from "axios";

const userApi = axios.create({
  // baseURL: "https://br6r7tz3-5000.inc1.devtunnels.ms/api",
  baseURL: "https://al-ansar-dry-fruits-backend.onrender.com/api",
});

userApi.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return req;
});

export default userApi;
