/**
 * Servicio de autenticación y manejo de sesión
 */
const CLAVE_SESION = 'sesion'
const CLAVE_USUARIO = 'usuario_actual'

export const authService = {
    /**
     * Valida credenciales de acceso
     * @param {string} usuario
     * @param {string} password
     * @returns {Promise<{ ok: boolean, mensaje?: string }>}
     */
    async login(usuario, password) {
        // Simulación de latencia de red para UX fluida
        await new Promise((resolve) => setTimeout(resolve, 400))

        const usuarioLimpio = usuario.trim()

        if (usuarioLimpio !== 'devcassa') {
            throw new Error('El usuario ingresado no existe en el sistema')
        }

        if (password !== 'cassa123') {
            throw new Error('La contraseña ingresada es incorrecta')
        }

        localStorage.setItem(CLAVE_SESION, 'true')
        localStorage.setItem(CLAVE_USUARIO, usuarioLimpio)

        window.dispatchEvent(new Event('sesionCambiada'))

        return { ok: true, usuario: usuarioLimpio }
    },

    /**
     * Cierra la sesión activa
     */
    logout() {
        localStorage.removeItem(CLAVE_SESION)
        localStorage.removeItem(CLAVE_USUARIO)
        window.dispatchEvent(new Event('sesionCambiada'))
    },

    /**
     * Verifica si existe una sesión activa
     * @returns {boolean}
     */
    isAuthenticated() {
        return localStorage.getItem(CLAVE_SESION) === 'true'
    },

    /**
     * Obtiene el nombre del usuario con sesión activa
     * @returns {string}
     */
    getUsuarioActual() {
        return localStorage.getItem(CLAVE_USUARIO) || 'devcassa'
    },
}

export default authService
