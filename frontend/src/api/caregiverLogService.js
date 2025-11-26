import api from "./axiosInstance";

export const getCaregiverLogs = async () => {
    try {
        const res = await api.get("/api/caregiver-log/");
        return res.data;
    } catch (err) {
        console.error("Error getting caregiver logs:", err.response?.data || err);
        throw err;
    }
};

export const getCaregiverLog = async (id) => {
    try {
        const res = await api.get(`/api/caregiver-log/${id}/`);
        return res.data;
    } catch (err) {
        console.error("Error getting caregiver log:", err.response?.data || err);
        throw err;
    }
};

export const createCaregiverLog = async (data) => {
    try {
        const res = await api.post("/api/caregiver-log/", data);
        return res.data;
    } catch (err) {
        console.error("Error creating caregiver log:", err.response?.data || err);
        throw err;
    }
};

export const updateCaregiverLog = async (id, payload) => {
    try {
        const res = await api.patch(`/api/caregiver-log/${id}/`, payload);
        return res.data;
    } catch (err) {
        console.error("Error updating caregiver log:", err.response?.data || err);
        throw err;
    }
};

export const deleteCaregiverLog = async (id) => {
    try {
        await api.delete(`/api/caregiver-log/${id}/`);
    } catch (err) {
        console.error("Error deleting caregiver log:", err.response?.data || err);
        throw err;
    }
};
