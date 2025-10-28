import api from './axiosInstance';

export const getUserProfile = async () => {
  try {
    const res = await api.get("/api/users/me");
    console.log("Usuario:", res.data);
    return res.data
  } catch (err) {
    console.error("Error al obtener usuario:", err.response?.data || err);
  }
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/api/users/me/', data);
  return response.data;
};
