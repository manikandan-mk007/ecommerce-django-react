export const saveAdminToken = (token) => {
  localStorage.setItem("adminToken", token);
};

export const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

export const removeAdminToken = () => {
  localStorage.removeItem("adminToken");
};

export const isAdminLoggedIn = () => {
  return Boolean(getAdminToken());
};