import api from './axiosInstance';

/**
 * Get all support requests for the authenticated user
 */
export const getSupportRequests = async () => {
    try {
        const response = await api.get('/api/support-requests/');
        console.log('Solicitudes de apoyo:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo solicitudes:', error.response?.data || error);
        throw error;
    }
};

/**
 * Create a new support request
 */
export const createSupportRequest = async (data) => {
    try {
        const response = await api.post('/api/support-requests/', data);
        console.log('Solicitud creada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creando solicitud:', error.response?.data || error);
        throw error;
    }
};

/**
 * Update a support request
 */
export const updateSupportRequest = async (id, data) => {
    try {
        const response = await api.put(`/api/support-requests/${id}/`, data);
        console.log('Solicitud actualizada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error actualizando solicitud:', error.response?.data || error);
        throw error;
    }
};

/**
 * Delete a support request
 */
export const deleteSupportRequest = async (id) => {
    try {
        const response = await api.delete(`/api/support-requests/${id}/`);
        console.log('Solicitud eliminada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error eliminando solicitud:', error.response?.data || error);
        throw error;
    }
};

/**
 * Assign a caregiver to a support request
 */
export const assignCaregiverToRequest = async (requestId, caregiverId) => {
    try {
        const response = await api.post(`/api/support-requests/${requestId}/assign/`, {
            caregiver_id: caregiverId
        });
        console.log('Cuidador asignado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error asignando cuidador:', error.response?.data || error);
        throw error;
    }
};

/**
 * Update the status of a support request
 */
export const updateRequestStatus = async (requestId, status, actualStart = null, actualEnd = null) => {
    try {
        const data = { status };
        if (actualStart) data.actual_start = actualStart;
        if (actualEnd) data.actual_end = actualEnd;

        const response = await api.post(`/api/support-requests/${requestId}/update-status/`, data);
        console.log('Estado actualizado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error actualizando estado:', error.response?.data || error);
        throw error;
    }
};

/**
 * Get all available support requests (from other caregivers)
 */
export const getAvailableSupportRequests = async () => {
    try {
        const response = await api.get('/api/support-requests/available/');
        console.log('Solicitudes disponibles:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo solicitudes disponibles:', error.response?.data || error);
        throw error;
    }
};
