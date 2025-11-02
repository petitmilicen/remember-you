import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useCitasMedicas from "../../hooks/useCitasMedicas";
import CitaItem from "../../components/cuidador/CitaItem";
import ModalCita from "../../components/cuidador/ModalCita";
import { styles } from "../../styles/CitasMedicasStyles";

export default function CitasMedicasScreen() {
  const {
    citas,
    modalVisible,
    setModalVisible,
    editando,
    doctor,
    setDoctor,
    descripcion,
    setDescripcion,
    fecha,
    setFecha,
    agregarCita,
    editarCita,
    guardarEdicion,
    eliminarCita,
    limpiarCitas,
    cerrarModal,
  } = useCitasMedicas();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Citas Médicas</Text>
        {citas.length > 0 && (
          <TouchableOpacity onPress={limpiarCitas}>
            <Ionicons name="trash-outline" size={22} color="#B71C1C" />
          </TouchableOpacity>
        )}
      </View>

      {citas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={60} color="#CFD8DC" />
          <Text style={styles.emptyText}>No hay citas agendadas</Text>
          <Text style={styles.emptySub}>Agrega una cita médica para comenzar</Text>
        </View>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <CitaItem
              item={item}
              onEdit={editarCita}
              onDelete={eliminarCita}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <ModalCita
        visible={modalVisible}
        onClose={cerrarModal}
        onSave={editando ? guardarEdicion : agregarCita}
        doctor={doctor}
        setDoctor={setDoctor}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        fecha={fecha}
        setFecha={setFecha}
        editando={!!editando}
      />
    </View>
  );
}
