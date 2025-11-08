import { useState } from "react";
import { Alert } from "react-native";
import { createMedicalLog, getMedicalLogs } from "../api/medicalLogService";

function formatDate(date) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const year = date.getFullYear();
  return `${dayName}, ${day} de ${month} ${year}`;
}

export default function useBitacora() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const loadNotes = async () => {
    try {
      const logs = await getMedicalLogs();

      if (Array.isArray(logs)) {
        const formatted = logs.map((log) => ({
          id: log.medical_log_id,
          text: log.description,
          date: new Date(log.created_at).toLocaleString("es-ES"),
        }));
        setNotes(formatted);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error al cargar las notas:", error);
      Alert.alert("Error", "No se pudieron cargar las notas desde el servidor.");
    }
  };

  const handleSave = async () => {
    if (text.trim() === "") return;

    try {
      if (editingNote) {
        setNotes((prev) =>
          prev.map((note) =>
            note.id === editingNote.id ? { ...note, text } : note
          )
        );
        setEditingNote(null);
      } else {
        const newLog = {
          description: text, 
        };

        const createdLog = await createMedicalLog(newLog);
      }

      setText("");
    } catch (error) {
      console.error("Error al guardar la bitácora:", error);
      Alert.alert("Error", "No se pudo guardar la entrada en la bitácora.");
    }
  };

  const handleEdit = (note) => {
    setText(note.text);
    setEditingNote(note);
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar nota", "¿Seguro que quieres eliminar esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setNotes((prev) => prev.filter((note) => note.id !== id));
          if (editingNote?.id === id) {
            setEditingNote(null);
            setText("");
          }
        },
      },
    ]);
  };

  return { text, setText, notes, handleSave, handleEdit, handleDelete, loadNotes};
}
