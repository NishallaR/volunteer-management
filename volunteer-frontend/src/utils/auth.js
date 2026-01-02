import jwtDecode from "jwt-decode";

export const getUserType = () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.user_type;
  } catch {
    return null;
  }
};

export const getAuthHeader = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
