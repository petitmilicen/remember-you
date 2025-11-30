import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login as loginService,
  logout as logoutService,
  refreshAccessToken,
} from "./authService";
import { getUserProfile } from "../api/userService";
import authManager from "./authManager";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const tokens = await loginService(email, password);
      await AsyncStorage.setItem("access", tokens.access);
      await AsyncStorage.setItem("refresh", tokens.refresh);

      const profile = await getUserProfile();
      setUser(profile);
    } catch (err) {
      console.error("Error en login:", err.response?.data || err);
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    try {
      const access = await AsyncStorage.getItem("access");
      const refresh = await AsyncStorage.getItem("refresh");

      if (!access && !refresh) {
        setUser(null);
        return;
      }

      if (access) {
        await logoutService();
      }
    } catch (error) {
      console.error("Error al cerrar sesión en backend:", error.response?.data || error.message);
    } finally {
      await AsyncStorage.multiRemove(["access", "refresh"]);
      setUser(null);
      console.log("Sesión cerrada correctamente");
    }
  };

  /**
   * Forzar logout cuando la sesión expira (llamado por authManager)
   * @param {string} reason - Razón de la expiración
   */
  const forceLogout = async (reason = 'Sesión expirada') => {
    console.log(`🔒 ${reason} - Cerrando sesión automáticamente`);
    await AsyncStorage.multiRemove(['access', 'refresh']);
    setUser(null);
  };

  const checkSession = async () => {
    try {
      const access = await refreshAccessToken();
      if (access) {
        const profile = await getUserProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Could not refresh session:", error);
      setUser(null);
    }
  };

  const loadSession = async () => {
    try {
      const access = await AsyncStorage.getItem("access");
      const refresh = await AsyncStorage.getItem("refresh");

      if (!access || !refresh) {
        console.log("No saved tokens");
        setUser(null);
        return;
      }

      try {
        const data = await getUserProfile();
        setUser(data);
        console.log("Session loaded:", data);
      } catch (error) {
        console.log("Trying getting new token");

        const newAccess = await refreshAccessToken();
        if (newAccess) {
          const data = await getUserProfile();
          setUser(data);
          console.log("Restored new session", data);
        } else {
          console.log("Could not get new token");
          await AsyncStorage.multiRemove(["access", "refresh"]);
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error al cargar la sesión:", error);
      await AsyncStorage.multiRemove(["access", "refresh"]);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("loadSession");
    loadSession();

    // Registrar callback para cuando la sesión expire desde axiosInstance
    authManager.setSessionExpiredCallback(forceLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkSession,
        forceLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
