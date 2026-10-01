import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor para estandarizar manejo de errores si se requiere
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const mensaje =
            error.response?.data?.mensaje ||
            error.message ||
            'Error de conexión con el servidor'
        return Promise.reject(new Error(mensaje))
    }
)

export default api