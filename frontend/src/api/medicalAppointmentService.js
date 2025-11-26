import api from "./axiosInstance";

export const getMedicalAppointments = async () => {
    try {
        const res = await api.get("/api/medical-appointment/");
        return res.data;
    } catch (err) {
        console.error("Error getting medical appointments:", err.response?.data || err);
        throw err;
    }
};

export const getMedicalAppointment = async (id) => {
    try {
        const res = await api.get(`/api/medical-appointment/${id}/`);
        return res.data;
    } catch (err) {
        console.error("Error getting medical appointment:", err.response?.data || err);
        throw err;
    }
};

export const createMedicalAppointment = async (data) => {
    try {
        console.log("Sending medical appointment data:", data);
        const res = await api.post("/api/medical-appointment/", data);
        console.log("Response received:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error creating medical appointment:", err.response?.data || err);
        console.error("Full error object:", err);
        throw err;
    }
};

export const updateMedicalAppointment = async (id, payload) => {
    try {
        const res = await api.patch(`/api/medical-appointment/${id}/`, payload);
        return res.data;
    } catch (err) {
        console.error("Error updating medical appointment:", err.response?.data || err);
        throw err;
    }
};

export const deleteMedicalAppointment = async (id) => {
    try {
        await api.delete(`/api/medical-appointment/${id}/`);
    } catch (err) {
        console.error("Error deleting medical appointment:", err.response?.data || err);
        throw err;
    }
};
