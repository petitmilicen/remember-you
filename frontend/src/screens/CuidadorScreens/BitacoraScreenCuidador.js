import React from "react";
import { View, Text, TouchableOpacity, FlatList, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBitacoraCuidador from "../../hooks/useBitacoraCuidador";
import RegistroItem from "../../components/cuidador/RegistroItem";
import ModalRegistro from "../../components/cuidador/ModalRegistro";
import { styles } from "../../styles/BitacoraCuidadorStyles";

export default function BitacoraScreenCuidador({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    bitacora,
    modalVisible,
    setModalVisible,
    nuevoEvento,
    setNuevoEvento,
    categoria,
    setCategoria,
    editando,
    agregarRegistro,
    editarRegistro,
    guardarEdicion,
    eliminarRegistro,
    limpiarBitacora,
    cerrarModal,
  } = useBitacoraCuidador();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bitácora del Cuidador</Text>

        {bitacora.length > 0 && (
          <TouchableOpacity onPress={limpiarBitacora}>
            <Ionicons name="trash-outline" size={22} color="#B71C1C" />
          </TouchableOpacity>
        )}
        {bitacora.length === 0 && <View style={{ width: 22 }} />}
      </View>

      {bitacora.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#CFD8DC" />
          <Text style={styles.emptyText}>No hay registros aún</Text>
          <Text style={styles.emptySub}>Agrega tus primeras observaciones</Text>
        </View>
      ) : (
        <FlatList
          data={bitacora}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <RegistroItem
              item={item}
              onEdit={editarRegistro}
              onDelete={eliminarRegistro}
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

      <ModalRegistro
        visible={modalVisible}
        onClose={cerrarModal}
        onSave={editando ? guardarEdicion : agregarRegistro}
        categoria={categoria}
        setCategoria={setCategoria}
        descripcion={nuevoEvento}
        setDescripcion={setNuevoEvento}
        editando={!!editando}
      />
    </View>
  );
}
