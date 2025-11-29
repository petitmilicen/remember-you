import { useEffect, useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { AuthContext } from "../../auth/AuthContext";

export default function LogoutScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const doLogout = async () => {
      await logout(); 
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }], 
      });
    };

    doLogout();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#000" />
      <Text>Cerrando sesión...</Text>
    </View>
  );
}
