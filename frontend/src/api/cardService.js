import api from './axiosInstance';

export const getCards = async () => {
  try {
    const res = await api.get("/api/card/");
    return res.data;
  } catch (err) {
    console.error("Error getting cards:", err.response?.data || err);
  }
};

export const getCard = async (id) => {
  try {
    const res = await api.get(`/api/card/${id}/`);
    return res.data;
  } catch (err) {
    console.error("Error getting card:", err.response?.data || err);
  }
};

export const createCard = async (data) => {
  try {
    const res = await api.post("/api/card/", data);
    return res.data;
  } catch (err) {
    console.error("Error creating card:", err.response?.data || err);
  }
};

export const updateCard = async (id, data) => {
  try {
    const res = await api.put(`/api/card/${id}/`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating card:", err.response?.data || err);
  }
};

export const deleteCard = async (id) => {
  try {
    await api.delete(`/api/card/${id}/`);
  } catch (err) {
    console.error("Error deleting memory:", err.response?.data || err);
  }
};