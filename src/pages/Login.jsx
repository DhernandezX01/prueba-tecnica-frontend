import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { useToast } from '../hooks/useToast'
import Spinner from '../components/common/Spinner'
import logoCassa from '../assets/logo-cassa.png'

export default function Login() {
    const navigate = useNavigate()
    const toast = useToast()

    // Estados del formulario
    const [usuario, setUsuario] = useState('')
    const [password, setPassword] = useState('')
    const [mostrarPassword, setMostrarPassword] = useState(false)

    // Estados de validación
    const [errorUsuario, setErrorUsuario] = useState('')
    const [errorPassword, setErrorPassword] = useState('')

    // Estado de carga
    const [cargando, setCargando] = useState(false)

    const iniciarSesion = async (e) => {
        e.preventDefault()

        setErrorUsuario('')
        setErrorPassword('')

        let hayError = false

        // =========================
        // VALIDAR CAMPOS REQUERIDOS
        // =========================
        if (usuario.trim() === '') {
            setErrorUsuario('Debe ingresar el nombre de usuario')
            hayError = true
        }

        if (password.trim() === '') {
            setErrorPassword('Debe ingresar la contraseña')
            hayError = true
        }

        if (hayError) {
            toast.warning('Por favor complete todos los campos requeridos', 'Campos obligatorios')
            return
        }

        // =========================
        // PROCESAR AUTENTICACIÓN
        // =========================
        try {
            setCargando(true)

            await authService.login(usuario, password)

            toast.success('¡Bienvenido al sistema de Prueba Agrícola!', 'Inicio de sesión exitoso')

            navigate('/dashboard', { replace: true })
        } catch (error) {
            const mensaje = error.message || 'Error de credenciales'

            if (mensaje.toLowerCase().includes('usuario')) {
                setErrorUsuario(mensaje)
            } else if (mensaje.toLowerCase().includes('contraseña')) {
                setErrorPassword(mensaje)
            }

            toast.error(mensaje, 'Acceso denegado')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
            {/* Decoración de fondo ambiental */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 border border-white/20 p-8 sm:p-10">
                {/* ENCABEZADO CON LOGO */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-lg shadow-slate-900/5 mb-4 ring-8 ring-emerald-500/10 border border-slate-100">
                        <img
                            src={logoCassa}
                            alt="Logo Grupo CASSA"
                            className="w-24 h-24 object-contain"
                        />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                        Aplicacion Web Agricola
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Plataforma de Control y Gestión de Haciendas
                    </p>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={iniciarSesion} className="space-y-5" noValidate>
                    {/* USUARIO */}
                    <div>
                        <label
                            htmlFor="usuario-input"
                            className="block text-sm font-semibold text-slate-700 mb-1.5"
                        >
                            Usuario
                        </label>

                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </span>

                            <input
                                id="usuario-input"
                                type="text"
                                value={usuario}
                                onChange={(e) => {
                                    setUsuario(e.target.value)
                                    if (errorUsuario) setErrorUsuario('')
                                }}
                                placeholder="Ingrese su Usuario"
                                className={`w-full bg-slate-50/70 border rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errorUsuario
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                    : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/10'
                                    }`}
                            />
                        </div>

                        {errorUsuario && (
                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {errorUsuario}
                            </p>
                        )}
                    </div>

                    {/* CONTRASEÑA */}
                    <div>
                        <label
                            htmlFor="password-input"
                            className="block text-sm font-semibold text-slate-700 mb-1.5"
                        >
                            Contraseña
                        </label>

                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </span>

                            <input
                                id="password-input"
                                type={mostrarPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (errorPassword) setErrorPassword('')
                                }}
                                placeholder="••••••••"
                                className={`w-full bg-slate-50/70 border rounded-xl pl-11 pr-12 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errorPassword
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                    : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/10'
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarPassword(!mostrarPassword)
                                }
                                aria-label={
                                    mostrarPassword
                                        ? 'Ocultar contraseña'
                                        : 'Mostrar contraseña'
                                }
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {mostrarPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {errorPassword && (
                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {errorPassword}
                            </p>
                        )}
                    </div>

                    {/* BOTÓN INICIAR SESIÓN CON SPINNER */}
                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {cargando ? (
                            <>
                                <Spinner size="sm" color="white" inline />
                                <span>Verificando credenciales...</span>
                            </>
                        ) : (
                            <span>Iniciar Sesión</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Buenas Energias <br />
                        <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                            Grupo CASSA
                        </code>
                    </p>
                </div>
            </div>
        </div>
    )
}