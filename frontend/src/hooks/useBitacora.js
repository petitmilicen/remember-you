import { useState } from "react";
import { Alert } from "react-native";
import {
  createMedicalLog,
  getMedicalLogs,
  updateMedicalLog,
  deleteMedicalLog,
} from "../api/medicalLogService";

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
          created_at: log.created_at,
        }));
        // Ordenar del más reciente al más antiguo
        formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotes(formatted);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error al cargar las notas:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar las notas desde el servidor."
      );
    }
  };

  const handleSave = async () => {
    if (text.trim() === "") return;

    try {
      if (editingNote) {
        console.log("✏️ Actualizando nota con ID:", editingNote.id);

        // 🔸 Actualiza en el backend
        const updated = await updateMedicalLog(editingNote.id, {
          description: text,
        });

        if (updated) {
          setNotes((prev) =>
            prev.map((note) =>
              note.id === editingNote.id
                ? {
                  ...note,
                  text: updated.description,
                  date: new Date(
                    updated.updated_at || Date.now()
                  ).toLocaleString("es-ES"),
                }
                : note
            )
          );
          console.log("✅ Nota actualizada en el backend:", updated);
        }

        setEditingNote(null);
      } else {
        console.log("🟢 Creando nueva nota");
        const created = await createMedicalLog({ description: text });
        if (created) {
          const formatted = {
            id: created.medical_log_id,
            text: created.description,
            date: new Date(created.created_at).toLocaleString("es-ES"),
          };
          setNotes((prev) => [formatted, ...prev]);
        }
      }

      setText("");
    } catch (error) {
      console.error(
        "Error al guardar/actualizar nota:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "No se pudo guardar o actualizar la nota en el servidor."
      );
    }
  };

  // 🔹 Este solo carga el texto al campo de edición
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
        onPress: async () => {
          try {
            await deleteMedicalLog(id);
            await loadNotes();
            if (editingNote?.id === id) {
              setEditingNote(null);
              setText("");
            }
          } catch (error) {
            console.error("Error al eliminar nota:", error);
            Alert.alert("Error", "No se pudo eliminar la nota.");
          }
        },
      },
    ]);
  };

  return {
    text,
    setText,
    notes,
    handleSave,
    handleEdit,
    handleDelete,
    loadNotes,
  };
}
