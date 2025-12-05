import React from "react";
import { View, Text, TouchableOpacity, FlatList, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCitasMedicas from "../../hooks/useCitasMedicas";
import CitaItem from "../../components/cuidador/CitaItem";
import ModalCita from "../../components/cuidador/ModalCita";
import { styles } from "../../styles/CitasMedicasStyles";

export default function CitasMedicasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
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
    status,
    setStatus,
    agregarCita,
    editarCita,
    guardarEdicion,
    eliminarCita,
    limpiarCitas,
    cerrarModal,
  } = useCitasMedicas();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Citas Médicas</Text>
        {citas.length > 0 && (
          <TouchableOpacity onPress={limpiarCitas}>
            <Ionicons name="trash-outline" size={22} color="#B71C1C" />
          </TouchableOpacity>
        )}
        {citas.length === 0 && <View style={{ width: 22 }} />}
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
        status={status}
        setStatus={setStatus}
        editando={!!editando}
      />
    </View>
  );
}
