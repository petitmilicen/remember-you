import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import {
  getSupportRequests,
  createSupportRequest,
  deleteSupportRequest,
  assignCaregiverToRequest,
  updateRequestStatus,
  getAvailableSupportRequests
} from "../api/supportRequestService";
import { getAvailableCaregivers, getUserProfile } from "../api/userService";
import eventEmitter, { EVENTS } from "../utils/eventEmitter";

export default function useRedApoyo() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesDisponibles, setSolicitudesDisponibles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [nota, setNota] = useState("");
  const [cuidadores, setCuidadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tienePacienteAsignado, setTienePacienteAsignado] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const ESTADOS = {
    ESPERA: "En espera",
    ASIGNADA: "Asignada",
    CURSO: "En curso",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    await Promise.all([
      cargarPerfilUsuario(),
      cargarCuidadores(),
      cargarSolicitudes(),
      cargarSolicitudesDisponibles()
    ]);
  };

  const cargarPerfilUsuario = async () => {
    try {
      const perfil = await getUserProfile();
      setTienePacienteAsignado(perfil.patient !== null);
      setCurrentUserId(perfil.id);
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  const cargarCuidadores = async () => {
    try {
      const data = await getAvailableCaregivers();

      const cuidadoresTransformados = data.caregivers.map((c) => ({
        id: c.id.toString(),
        nombre: c.full_name,
        avatar: c.avatar,
        disponible: c.disponible,
        email: c.email,
        telefono: c.phone_number || 'No registrado'
      }));

      setCuidadores(cuidadoresTransformados);
    } catch (error) {
      console.error('Error cargando cuidadores:', error);
      Alert.alert('Error', 'No se pudieron cargar los cuidadores disponibles.');
    }
  };

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await getSupportRequests();

      const solicitudesTransformadas = data.map((s) => ({
        id: s.id,
        motivo: s.reason,
        desde: new Date(s.start_datetime).toLocaleString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        hasta: new Date(s.end_datetime).toLocaleString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        nota: s.notes || '',
        estado: s.status,
        suplente: s.assigned_caregiver?.full_name || null,
        suplenteId: s.assigned_caregiver?.id || null,
        fechaInicio: s.actual_start ? new Date(s.actual_start).toLocaleString('es-CL') : null,
        fechaFin: s.actual_end ? new Date(s.actual_end).toLocaleString('es-CL') : null,
        postulaciones: []
      }));

      setSolicitudes(solicitudesTransformadas);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      Alert.alert('Error', 'No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  const cargarSolicitudesDisponibles = async () => {
    try {
      const data = await getAvailableSupportRequests();

      const solicitudesTransformadas = data.requests.map((s) => ({
        id: s.id,
        motivo: s.reason,
        desde: new Date(s.start_datetime).toLocaleString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        hasta: new Date(s.end_datetime).toLocaleString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        nota: s.notes || '',
        estado: s.status,
        solicitante: s.requester?.full_name || 'Desconocido',
        emailSolicitante: s.requester?.email || '',
        telefonoSolicitante: s.requester?.phone_number || '',
        suplente: null,
        suplenteId: null,
        fechaInicio: null,
        fechaFin: null,
        postulaciones: []
      }));

      setSolicitudesDisponibles(solicitudesTransformadas);
    } catch (error) {
      console.error('Error cargando solicitudes disponibles:', error);
    }
  };

  const crearSolicitud = async () => {
    if (!motivo.trim() || !fechaDesde || !fechaHasta) {
      Alert.alert("Campos incompletos", "Por favor completa motivo, fecha de inicio y fin.");
      return;
    }

    try {
      setLoading(true);

      const parseDateTime = (dateInput) => {
        if (!dateInput) throw new Error('Date input is missing');

        if (dateInput instanceof Date) {
          return dateInput.toISOString();
        }

        if (typeof dateInput === 'string') {
          // If ISO format
          if (dateInput.includes('T')) {
            return dateInput;
          }

          // Handle "DD/MM/YYYY" or "DD/MM/YYYY HH:MM"
          const parts = dateInput.split(' ');
          const datePart = parts[0];
          const timePart = parts[1] || "00:00"; // Default to 00:00 if missing

          if (!datePart.includes('/')) {
            throw new Error('Invalid date format');
          }

          const [day, month, year] = datePart.split('/');
          const [hours, minutes] = timePart.split(':');

          return new Date(year, month - 1, day, hours, minutes).toISOString();
        }

        throw new Error('Invalid date input type');
      };

      const requestData = {
        reason: motivo,
        start_datetime: parseDateTime(fechaDesde),
        end_datetime: parseDateTime(fechaHasta),
        notes: nota
      };

      await createSupportRequest(requestData);
      await cargarSolicitudes();

      setModalVisible(false);
      setMotivo("");
      setNota("");
      setFechaDesde("");
      setFechaHasta("");

      Alert.alert("Solicitud creada", "Tu solicitud ha sido creada exitosamente.");
    } catch (error) {
      console.error('Error creando solicitud:', error);
      Alert.alert("Error", "No se pudo crear la solicitud. Verifica los datos e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const asignarCuidador = async (solicitudId, cuidadorId) => {
    const idToAssign = cuidadorId || currentUserId;

    if (!idToAssign) {
      Alert.alert("Error", "No se pudo identificar el cuidador.");
      return;
    }

    try {
      setLoading(true);
      await assignCaregiverToRequest(solicitudId, parseInt(idToAssign));

      await Promise.all([
        cargarSolicitudes(),
        cargarSolicitudesDisponibles(),
        cargarCuidadores(),
        cargarPerfilUsuario()
      ]);

      // Emit event immediately (delay handled in listener)
      eventEmitter.emit(EVENTS.PATIENT_CHANGED);

      Alert.alert("Apoyo asignado", "Has tomado esta solicitud exitosamente.");
    } catch (error) {
      console.error('Error asignando cuidador:', error);
      Alert.alert("Error", "No se pudo asignar el cuidador.");
    } finally {
      setLoading(false);
    }
  };

  const iniciarApoyo = async (id) => {
    try {
      setLoading(true);
      await updateRequestStatus(id, ESTADOS.CURSO);
      await cargarSolicitudes();
    } catch (error) {
      console.error('Error iniciando apoyo:', error);
      Alert.alert("Error", "No se pudo iniciar el apoyo.");
    } finally {
      setLoading(false);
    }
  };

  const finalizarApoyo = async (id) => {
    try {
      setLoading(true);
      await updateRequestStatus(id, ESTADOS.FINALIZADA);
      await Promise.all([
        cargarSolicitudes(),
        cargarPerfilUsuario()
      ]);

      // Emit event immediately (delay handled in listener)
      eventEmitter.emit(EVENTS.PATIENT_CHANGED);

      Alert.alert("Apoyo finalizado", "El apoyo ha sido marcado como finalizado.");
    } catch (error) {
      console.error('Error finalizando apoyo:', error);
      Alert.alert("Error", "No se pudo finalizar el apoyo.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarApoyo = async (id) => {
    try {
      setLoading(true);
      await updateRequestStatus(id, ESTADOS.CANCELADA);
      await Promise.all([
        cargarSolicitudes(),
        cargarPerfilUsuario()
      ]);

      // Emit event immediately (delay handled in listener)
      eventEmitter.emit(EVENTS.PATIENT_CHANGED);
    } catch (error) {
      console.error('Error cancelando apoyo:', error);
      Alert.alert("Error", "No se pudo cancelar el apoyo.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarApoyo = async (id) => {
    try {
      setLoading(true);
      await deleteSupportRequest(id);
      await cargarSolicitudes();
    } catch (error) {
      console.error('Error eliminando apoyo:', error);
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const filtroActivo = useMemo(
    () => solicitudes.filter((s) => s.estado !== ESTADOS.FINALIZADA),
    [solicitudes]
  );

  return {
    solicitudes,
    solicitudesDisponibles,
    modalVisible,
    setModalVisible,
    motivo,
    setMotivo,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    nota,
    setNota,
    cuidadores,
    crearSolicitud,
    asignarCuidador,
    iniciarApoyo,
    finalizarApoyo,
    cancelarApoyo,
    eliminarApoyo,
    filtroActivo,
    ESTADOS,
    loading,
    cargarDatos,
    tienePacienteAsignado
  };
}
