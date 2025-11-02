import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "../../styles/HomeCuidadorStyles.js";

export default function QuickMenu({ navigation }) {
  return (
    <View style={styles.quickMenu}>
      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: "#B3E5FC" }]}
        onPress={() => navigation.navigate("BitacoraCuidador")}
      >
        <MaterialIcons name="menu-book" size={26} color="#0D47A1" />
        <Text style={styles.menuText}>Bitácora</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: "#C8E6C9" }]}
        onPress={() => navigation.navigate("ZonaSegura")}
      >
        <Ionicons name="shield-checkmark" size={26} color="#1B5E20" />
        <Text style={styles.menuText}>Seguridad</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: "#FFF9C4" }]}
        onPress={() => navigation.navigate("CitasMedicas")}
      >
        <Ionicons name="calendar" size={26} color="#F57F17" />
        <Text style={styles.menuText}>Citas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: "#E1BEE7" }]}
        onPress={() => navigation.navigate("RedApoyo")}
      >
        <FontAwesome5 name="hands-helping" size={24} color="#6A1B9A" />
        <Text style={styles.menuText}>Red de Apoyo</Text>
      </TouchableOpacity>
    </View>
  );
}
