import api from './axiosInstance';

export const getMemories = async () => {
  try {
    const res = await api.get("/api/memory/");
    return res.data;
  } catch (err) {
    console.error("Error getting memories:", err.response?.data || err);
  }
};

export const getMemory = async (id) => {
  try {
    const res = await api.get(`/api/memory/${id}/`);
    return res.data;
  } catch (err) {
    console.error("Error getting memory:", err.response?.data || err);
  }
};

export const createMemory = async (data) => {
  try {
    const res = await api.post("/api/memory/", data);
    return res.data;
  } catch (err) {
    console.error("Error creating memory:", err.response?.data || err);
  }
};

export const updateMemory = async (id, data) => {
  try {
    const res = await api.put(`/api/memory/${id}/`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating memory:", err.response?.data || err);
  }
};

export const deleteMemory = async (id) => {
  try {
    await api.delete(`/api/memory/${id}/`);
  } catch (err) {
    console.error("Error deleting memory:", err.response?.data || err);
  }
};