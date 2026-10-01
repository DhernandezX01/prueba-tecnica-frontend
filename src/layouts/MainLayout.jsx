import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { useToast } from '../hooks/useToast'
import ModalConfirmacion from '../components/common/ModalConfirmacion'

export default function MainLayout() {
    const navigate = useNavigate()
    const toast = useToast()

    const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false)
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

    const usuario = authService.getUsuarioActual()

    const handleConfirmarCerrarSesion = () => {
        setModalLogoutAbierto(false)
        authService.logout()
        toast.info('La sesión se ha cerrado correctamente', 'Sesión finalizada')
        navigate('/', { replace: true })
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
            {/* BARRA SUPERIOR PARA DISPOSITIVOS MÓVILES */}
            <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        🌾
                    </div>
                    <span className="font-bold text-base tracking-tight">
                        Prueba Agrícola
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    aria-label="Abrir menú"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {menuMovilAbierto ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </header>

            {/* SIDEBAR DE ESCRITORIO Y MÓVIL */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${menuMovilAbierto ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* LOGO Y ENCABEZADO */}
                <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 shrink-0">
                        <img
                            src="/logo-cassa.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                            Gestion de Haciendas
                        </h1>
                        <span className="text-xs text-emerald-400 font-medium">
                            Panel de Gestión
                        </span>
                    </div>
                </div>

                {/* NAVEGACIÓN */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <NavLink
                        to="/dashboard"
                        onClick={() => setMenuMovilAbierto(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${isActive
                                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        <svg
                            className="w-5 h-5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        </svg>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/haciendas"
                        onClick={() => setMenuMovilAbierto(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${isActive
                                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        <svg
                            className="w-5 h-5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <span>Haciendas</span>
                    </NavLink>
                </nav>

                {/* USUARIO Y CERRAR SESIÓN */}
                <div className="p-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                            {usuario.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">
                                {usuario}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                                Administrador
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setModalLogoutAbierto(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* FONDO OSCURO PARA MENÚ MÓVIL */}
            {menuMovilAbierto && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
                    onClick={() => setMenuMovilAbierto(false)}
                />
            )}

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <Outlet />
            </main>

            {/* MODAL DE CONFIRMACIÓN PARA CERRAR SESIÓN */}
            <ModalConfirmacion
                isOpen={modalLogoutAbierto}
                onClose={() => setModalLogoutAbierto(false)}
                onConfirm={handleConfirmarCerrarSesion}
                tipo="warning"
                titulo="¿Cerrar Sesión?"
                mensaje="¿Está seguro de que desea salir del sistema? Tendrá que ingresar nuevamente sus credenciales."
                textoConfirmar="Sí, cerrar sesión"
                textoCancelar="Permanecer aquí"
            />
        </div>
    )
}