import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import authService from './services/authService'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Haciendas from './pages/Haciendas'
import MainLayout from './layouts/MainLayout'

export default function App() {
    const [estaAutenticado, setEstaAutenticado] = useState(
        authService.isAuthenticated()
    )

    useEffect(() => {
        const actualizarSesion = () => {
            setEstaAutenticado(authService.isAuthenticated())
        }

        window.addEventListener('sesionCambiada', actualizarSesion)

        return () => {
            window.removeEventListener('sesionCambiada', actualizarSesion)
        }
    }, [])

    return (
        <ToastProvider>
            <Routes>
                <Route
                    path="/"
                    element={
                        estaAutenticado ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Login />
                        )
                    }
                />

                <Route
                    element={
                        estaAutenticado ? (
                            <MainLayout />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/haciendas" element={<Haciendas />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </ToastProvider>
    )
}