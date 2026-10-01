import api from './api'

/**
 * Servicio para gestión de haciendas (CRUD y métricas)
 */
export const haciendasService = {
    /**
     * Obtiene la lista completa de haciendas
     */
    async obtenerTodas() {
        const response = await api.get('/haciendas')
        return response.data
    },

    /**
     * Obtiene el conteo total de haciendas registradas
     */
    async obtenerTotal() {
        const response = await api.get('/haciendas/count')
        return response.data?.total ?? 0
    },

    /**
     * Registra una nueva hacienda
     * @param {{ nombre: string, ubicacion: string, estatus: string }} datos
     */
    async crear(datos) {
        const response = await api.post('/haciendas', datos)
        return response.data
    },

    /**
     * Actualiza los datos de una hacienda existente
     * @param {number|string} id
     * @param {{ nombre: string, ubicacion: string, estatus: string }} datos
     */
    async actualizar(id, datos) {
        const response = await api.put(`/haciendas/${id}`, datos)
        return response.data
    },

    /**
     * Elimina una hacienda por su ID
     * @param {number|string} id
     */
    async eliminar(id) {
        const response = await api.delete(`/haciendas/${id}`)
        return response.data
    },
}

export default haciendasService
