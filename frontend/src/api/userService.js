import api from './axiosInstance';

export const getUserProfile = async () => {
  try {
    const res = await api.get("/api/user-data/");
    return res.data
  } catch (err) {
    console.error("Error al obtener usuario:", err.response?.data || err);
  }
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/api/user-data/', data);
  return response.data;
};

export const uploadProfilePicture = async (imageUri) => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('profile_picture', {
      uri: imageUri,
      name: filename,
      type: type,
    });

    const response = await api.post('/api/user-data/upload-profile-picture/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error subiendo foto de perfil:', error.response?.data || error);
    throw error;
  }
};

export const deleteProfilePicture = async () => {
  try {
    const response = await api.delete('/api/user-data/delete-profile-picture/');
    return response.data;
  } catch (error) {
    console.error('Error eliminando foto de perfil:', error.response?.data || error);
    throw error;
  }
};

export const getPatientById = async (patientId) => {
  try {
    const response = await api.get(`/api/user-data/patient/${patientId}/`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo paciente:', error.response?.data || error);
    throw error;
  }
};

export const assignPatientToCaregiver = async (patientId) => {
  try {
    const response = await api.post('/api/user-data/assign-patient/', {
      patient_id: patientId
    });
    return response.data;
  } catch (error) {
    console.error('Error asignando paciente:', error.response?.data || error);
    throw error;
  }
};

export const unassignPatient = async () => {
  try {
    const response = await api.post('/api/user-data/unassign-patient/');
    return response.data;
  } catch (error) {
    console.error('Error desvinculando paciente:', error.response?.data || error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/api/user-data/delete-account/');
    return response.data;
  } catch (error) {
    console.error('Error eliminando cuenta:', error.response?.data || error);
    throw error;
  }
};

export const getAvailableCaregivers = async () => {
  try {
    const response = await api.get('/api/user-data/available-caregivers/');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo cuidadores disponibles:', error.response?.data || error);
    throw error;
  }
};


