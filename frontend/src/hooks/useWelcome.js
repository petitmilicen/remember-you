export default function useWelcome(navigation) {
  const goToLogin = () => navigation.navigate("LoginPaciente");
  const goToRegister = () => navigation.navigate("RegisterPaciente");
  const goToCuidador = () => navigation.navigate("LoginCuidador");

  return { goToLogin, goToRegister, goToCuidador };
}
