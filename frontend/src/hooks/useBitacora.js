import { useState } from "react";
import { Alert } from "react-native";

function formatDate(date) {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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

  const handleSave = () => {
    if (text.trim() === "") return;
    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id ? { ...note, text } : note
        )
      );
      setEditingNote(null);
    } else {
      const newNote = { id: Date.now(), text, date: formatDate(new Date()) };
      setNotes((prev) => [newNote, ...prev]);
    }
    setText("");
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

  return { text, setText, notes, handleSave, handleEdit, handleDelete };
}
