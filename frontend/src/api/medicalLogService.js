import api from './axiosInstance';

export const getMedicalLogs = async () => {
  try {
    const res = await api.get("/api/medical-log/");
    return res.data;
  } catch (err) {
    console.error("Error getting medical logs:", err.response?.data || err);
  }
};

export const getMedicalLog = async (id) => {
  try {
    const res = await api.get(`/api/medical-log/${id}/`);
    return res.data;
  } catch (err) {
    console.error("Error getting medical log:", err.response?.data || err);
  }
};

export const createMedicalLog = async (data) => {
  try {
    const res = await api.post("/api/medical-log/", data);
    return res.data;
  } catch (err) {
    console.error("Error creating medical log:", err.response?.data || err);
  }
};

export const updateMedicalLog = async (id, data) => {
  try {
    const res = await api.put(`/api/medical log/${id}/`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating medical log:", err.response?.data || err);
  }
};

export const deleteMedicalLog  = async (id) => {
  try {
    await api.delete(`/api/medical-log/${id}/`);
  } catch (err) {
    console.error("Error deleting medical log:", err.response?.data || err);
  }
};