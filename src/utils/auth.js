export const getUser = () => {
  const user = localStorage.getItem("userInfo");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("userInfo");
};
