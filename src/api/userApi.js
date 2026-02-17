import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

userApi.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return req;
});

export default userApi;
