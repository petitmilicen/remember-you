/**
 * AuthManager - Singleton para coordinar la expiración de sesión
 * entre axiosInstance y AuthContext sin dependencias circulares
 */
class AuthManager {
    constructor() {
        this.onSessionExpired = null;
    }

    /**
     * Registrar callback a llamar cuando la sesión expira
     * @param {Function} callback - Función a ejecutar cuando expira la sesión
     */
    setSessionExpiredCallback(callback) {
        this.onSessionExpired = callback;
    }

    /**
     * Notificar que la sesión ha expirado
     * @param {string} reason - Razón de la expiración
     */
    notifySessionExpired(reason = 'Sesión expirada') {
        if (this.onSessionExpired) {
            this.onSessionExpired(reason);
        } else {
            console.warn('⚠️ Sesión expirada pero no hay callback registrado');
        }
    }
}

export default new AuthManager();
