import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from "./src/screens/PacienteScreens/HomeScreen";
import ActividadesScreen from "./src/screens/PacienteScreens/ActividadesScreen";
import MemoriceScreen from "./src/games/Memorice/MemoriceScreen";
import CaminoCorrectoScreen from "./src/games/CaminoCorrecto/CaminoCorrectoScreen";
import PuzzleScreen from "./src/games/Puzzle/PuzzleScreen";
import SudokuScreen from './src/games/Sudoku/SudokuScreen';
import BitacoraScreen from "./src/screens/PacienteScreens/BitacoraScreen";
import TarjetasScreen from "./src/screens/PacienteScreens/TarjetasScreen";
import AddTarjetasScreen from "./src/screens/PacienteScreens/AddTarjetasScreen";
import RecuerdosScreen from "./src/screens/PacienteScreens/RecuerdosScreen";
import AddRecuerdosScreen from "./src/screens/PacienteScreens/AddRecuerdosScreen";
import DetalleRecuerdosScreen from "./src/screens/PacienteScreens/DetalleRecuerdosScreen";
import AjustesScreen from "./src/screens/PacienteScreens/AjustesScreen";
import LoginPacienteScreen from "./src/screens/PacienteScreens/LoginPacienteScreen";
import LoginCuidadorScreen from "./src/screens/CuidadorScreens/LoginCuidadorScreen";
import RegisterPacienteScreen from "./src/screens/PacienteScreens/RegisterPacienteScreen";
import RegisterCuidadorScreen from "./src/screens/CuidadorScreens/RegisterCuidadorScreen";
import PerfilPacienteScreen from "./src/screens/PacienteScreens/PerfilPacienteScreen";
import HomeScreenCuidador from "./src/screens/CuidadorScreens/HomeScreenCuidador";
import LectorQRScreen from "./src/screens/CuidadorScreens/LectorQRScreen";
import ZonaSeguraScreen from "./src/screens/CuidadorScreens/ZonaSeguraScreen";
import BitacoiraScreenCuidador from "./src/screens/CuidadorScreens/BitacoraScreenCuidador";
import CitasMedicasScreen from "./src/screens/CuidadorScreens/CitasMedicasScreen";
import RedApoyoScreen from "./src/screens/CuidadorScreens/RedApoyoScreen";
import { SettingsProvider } from './src/context/SettingsContext'; 
import { AuthProvider } from "./src/auth/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
    <SettingsProvider>
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
          <Stack.Screen name="CaminoCorrecto" component={CaminoCorrectoScreen} />
          <Stack.Screen name="Puzzle" component={PuzzleScreen}options={{ title: 'Rompecabezas' }}/>
          <Stack.Screen name="Sudoku" component={SudokuScreen}options={{ title: 'Sudoku' }}/>
          <Stack.Screen name="Bitacora" component={BitacoraScreen} />
          <Stack.Screen name="Tarjetas" component={TarjetasScreen} />
          <Stack.Screen name="AddTarjetas" component={AddTarjetasScreen} />
          <Stack.Screen name="Recuerdos" component={RecuerdosScreen} />
          <Stack.Screen name="AddRecuerdos" component={AddRecuerdosScreen} />
          <Stack.Screen name="DetalleRecuerdos" component={DetalleRecuerdosScreen} />
          <Stack.Screen name="Ajustes" component={AjustesScreen} />
          <Stack.Screen name="PerfilPaciente" component={PerfilPacienteScreen} />
          <Stack.Screen name="HomeCuidador" component={HomeScreenCuidador} />
          <Stack.Screen name="LectorQR" component={LectorQRScreen} />
          <Stack.Screen name="ZonaSegura" component={ZonaSeguraScreen} />
          <Stack.Screen name="BitacoraCuidador" component={BitacoiraScreenCuidador} />
          <Stack.Screen name="CitasMedicas" component={CitasMedicasScreen} />
          <Stack.Screen name="RedApoyo" component={RedApoyoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
    </AuthProvider>
  );
}
