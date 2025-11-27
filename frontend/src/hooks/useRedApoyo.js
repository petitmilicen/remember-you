import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useRedApoyo() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [nota, setNota] = useState("");
  const [pacienteUbicacion] = useState({
    latitude: -33.45694,
    longitude: -70.64827,
  });
  const [cuidadores, setCuidadores] = useState([]);

  const ESTADOS = {
    ESPERA: "En espera",
    ASIGNADA: "Asignada",
    CURSO: "En curso",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
  };

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("solicitudesApoyo");
      if (stored) setSolicitudes(JSON.parse(stored));
      generarCuidadoresCercanos();
    })();
  }, []);

  const generarCuidadoresCercanos = () => {
    const randomAround = (v) => v + (Math.random() - 0.5) * 0.008;
    const base = pacienteUbicacion;
    const simulados = [
      {
        id: "1",
        nombre: "Ana Torres",
        rating: 4.8,
        avatar: "AT",
        especialidad: "Alzheimer",
        experiencia: "5 años",
        disponible: true
      },
      {
        id: "2",
        nombre: "Pedro Silva",
        rating: 4.7,
        avatar: "PS",
        especialidad: "Demencia",
        experiencia: "3 años",
        disponible: true
      },
      {
        id: "3",
        nombre: "Laura Díaz",
        rating: 4.9,
        avatar: "LD",
        especialidad: "Alzheimer",
        experiencia: "7 años",
        disponible: true
      },
      {
        id: "4",
        nombre: "José López",
        rating: 4.6,
        avatar: "JL",
        especialidad: "Cuidados generales",
        experiencia: "2 años",
        disponible: Math.random() > 0.3 // 70% disponible
      },
    ].map((c) => {
      const lat = randomAround(base.latitude);
      const lon = randomAround(base.longitude);
      const distKm = Math.hypot((lat - base.latitude) * 111, (lon - base.longitude) * 111);
      const eta = Math.max(3, Math.round(distKm * 5 + Math.random() * 4));
      return {
        ...c,
        distancia: distKm.toFixed(1),
        eta,
        coord: { latitude: lat, longitude: lon }
      };
    });
    setCuidadores(simulados);
  };

  const guardar = async (data) => {
    setSolicitudes(data);
    await AsyncStorage.setItem("solicitudesApoyo", JSON.stringify(data));
  };

  const crearSolicitud = () => {
    if (!motivo.trim() || !fechaDesde.trim() || !fechaHasta.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa motivo, fecha de inicio y fin.");
      return;
    }

    // Simular postulaciones automáticas (1-3 cuidadores disponibles)
    const disponibles = cuidadores.filter(c => c.disponible);
    const numPostulaciones = Math.min(disponibles.length, Math.floor(Math.random() * 3) + 1);
    const postulantes = disponibles
      .sort(() => Math.random() - 0.5)
      .slice(0, numPostulaciones)
      .map(c => c.id);

    const nueva = {
      id: Date.now().toString(),
      motivo,
      desde: fechaDesde,
      hasta: fechaHasta,
      nota,
      estado: ESTADOS.ESPERA,
      suplente: null,
      suplenteId: null,
      postulaciones: postulantes,
      fechaInicio: null,
      fechaFin: null,
    };

    const actualizadas = [nueva, ...solicitudes];
    guardar(actualizadas);
    setModalVisible(false);
    setMotivo("");
    setNota("");
    setFechaDesde("");
    setFechaHasta("");

    Alert.alert("Solicitud creada", `${postulantes.length} cuidador(es) han mostrado interés.`);
  };

  const asignarCuidador = (solicitudId, cuidadorId) => {
    const cuidador = cuidadores.find(c => c.id === cuidadorId);
    if (!cuidador) return;

    const actualizadas = solicitudes.map((s) =>
      s.id === solicitudId
        ? { ...s, estado: ESTADOS.ASIGNADA, suplente: cuidador.nombre, suplenteId: cuidadorId }
        : s
    );
    guardar(actualizadas);
    Alert.alert("Apoyo asignado", `${cuidador.nombre} cubrirá este turno.`);
  };

  const iniciarApoyo = (id) => {
    const actualizadas = solicitudes.map((s) =>
      s.id === id
        ? { ...s, estado: ESTADOS.CURSO, fechaInicio: new Date().toLocaleString() }
        : s
    );
    guardar(actualizadas);
  };

  const finalizarApoyo = async (id) => {
    const actualizadas = solicitudes.map((s) =>
      s.id === id
        ? { ...s, estado: ESTADOS.FINALIZADA, fechaFin: new Date().toLocaleString() }
        : s
    );
    guardar(actualizadas);

    const finalizada = actualizadas.find((s) => s.id === id);
    const registro = {
      id: Date.now().toString(),
      tipo: "Apoyo finalizado",
      fecha: new Date().toLocaleString(),
      descripcion: `El cuidador suplente ${finalizada.suplente} completó el apoyo (${finalizada.motivo}).`,
    };
    const bitacora = (await AsyncStorage.getItem("bitacoraEntries")) || "[]";
    await AsyncStorage.setItem(
      "bitacoraEntries",
      JSON.stringify([registro, ...JSON.parse(bitacora)])
    );
  };

  const cancelarApoyo = (id) => {
    const actualizadas = solicitudes.map((s) =>
      s.id === id ? { ...s, estado: ESTADOS.CANCELADA } : s
    );
    guardar(actualizadas);
  };

  const eliminarApoyo = (id) => {
    const actualizadas = solicitudes.filter((s) => s.id !== id);
    guardar(actualizadas);
  };

  const filtroActivo = useMemo(
    () => solicitudes.filter((s) => s.estado !== ESTADOS.FINALIZADA),
    [solicitudes]
  );

  return {
    solicitudes,
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
    pacienteUbicacion,
    cuidadores,
    crearSolicitud,
    asignarCuidador,
    iniciarApoyo,
    finalizarApoyo,
    cancelarApoyo,
    eliminarApoyo,
    filtroActivo,
    ESTADOS,
  };
}
