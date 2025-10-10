import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ActividadesScreen from "./src/screens/ActividadesScreen";
import MemoriceScreen from "./src/games/Memorice/MemoriceScreen";
import BitacoraScreen from "./src/screens/BitacoraScreen";
import TarjetasScreen from "./src/screens/TarjetasScreen";
import AddTarjetasScreen from "./src/screens/AddTarjetasScreen";
import RecuerdosScreen from "./src/screens/RecuerdosScreen";
import AddRecuerdosScreen from "./src/screens/AddRecuerdosScreen";
import DetalleRecuerdosScreen from "./src/screens/DetalleRecuerdosScreen";
import AjustesScreen from "./src/screens/AjustesScreen";
import LoginPacienteScreen from "./src/screens/LoginPacienteScreen";
import LoginCuidadorScreen from "./src/screens/LoginCuidadorScreen";
import RegisterPacienteScreen from "./src/screens/RegisterPacienteScreen";
import RegisterCuidadorScreen from "./src/screens/RegisterCuidadorScreen";
import PerfilPacienteScreen from "./src/screens/PerfilPacienteScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LoginPaciente" component={LoginPacienteScreen} />
        <Stack.Screen name="LoginCuidador" component={LoginCuidadorScreen} />
        <Stack.Screen name="RegisterPaciente" component={RegisterPacienteScreen} />
        <Stack.Screen name="RegisterCuidador" component={RegisterCuidadorScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Actividades" component={ActividadesScreen} />
        <Stack.Screen name="Memorice" component={MemoriceScreen} />
        <Stack.Screen name="Bitacora" component={BitacoraScreen} />
        <Stack.Screen name="Tarjetas" component={TarjetasScreen} />
        <Stack.Screen name="AddTarjetas" component={AddTarjetasScreen} />
        <Stack.Screen name="Recuerdos" component={RecuerdosScreen} />
        <Stack.Screen name="AddRecuerdos" component={AddRecuerdosScreen} />
        <Stack.Screen name="DetalleRecuerdos" component={DetalleRecuerdosScreen} />
        <Stack.Screen name="Ajustes" component={AjustesScreen} />
        <Stack.Screen name="PerfilPaciente" component={PerfilPacienteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
