import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import haciendasService from '../services/haciendasService'
import { useToast } from '../hooks/useToast'
import Spinner from '../components/common/Spinner'

export default function Dashboard() {
    const toast = useToast()

    const [stats, setStats] = useState({
        total: 0,
        activas: 0,
        inactivas: 0,
    })
    const [haciendasRecientes, setHaciendasRecientes] = useState([])
    const [cargando, setCargando] = useState(true)

    const cargarDashboard = useCallback(async () => {
        try {
            setCargando(true)
            const lista = await haciendasService.obtenerTodas()

            const total = lista.length
            const activas = lista.filter((h) => h.estatus === 'Activo').length
            const inactivas = total - activas

            setStats({ total, activas, inactivas })
            setHaciendasRecientes(lista.slice(0, 5))
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error)
            toast.error(
                error.message || 'No se pudo sincronizar el resumen de haciendas',
                'Error de servidor'
            )
        } finally {
            setCargando(false)
        }
    }, [toast])

    useEffect(() => {
        cargarDashboard()
    }, [cargarDashboard])

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* ENCABEZADO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Dashboard Operativo
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Resumen general de haciendas agrícolas registradas
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={cargarDashboard}
                        disabled={cargando}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
                    >
                        <svg
                            className={`w-4 h-4 ${cargando ? 'animate-spin text-emerald-600' : 'text-slate-500'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span>{cargando ? 'Sincronizando...' : 'Actualizar'}</span>
                    </button>

                    <Link
                        to="/haciendas"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm shadow-emerald-600/20 active:scale-98"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span>Nueva Hacienda</span>
                    </Link>
                </div>
            </div>

            {/* TARJETAS DE MÉTRICAS (KPI) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* TOTAL */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Total de Haciendas
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <svg
                                className="w-5 h-5"
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
                        </div>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                        {cargando ? (
                            <Spinner size="sm" inline color="blue" />
                        ) : (
                            <span className="text-4xl font-extrabold text-slate-800">
                                {stats.total}
                            </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                            unidades productivas
                        </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Registradas en el sistema</span>
                        <Link
                            to="/haciendas"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Ver listado →
                        </Link>
                    </div>
                </div>

                {/* ACTIVAS */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Haciendas Activas
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                        {cargando ? (
                            <Spinner size="sm" inline color="primary" />
                        ) : (
                            <span className="text-4xl font-extrabold text-emerald-600">
                                {stats.activas}
                            </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                            en operación regular
                        </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            {stats.total > 0
                                ? `${Math.round((stats.activas / stats.total) * 100)}% de operatividad`
                                : '0% activo'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Operativo
                        </span>
                    </div>
                </div>

                {/* INACTIVAS */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Haciendas Inactivas
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                        {cargando ? (
                            <Spinner size="sm" inline color="gray" />
                        ) : (
                            <span className="text-4xl font-extrabold text-slate-700">
                                {stats.inactivas}
                            </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                            fuera de servicio
                        </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Requiere revisión</span>
                        <span className="text-slate-400 font-medium">
                            En espera
                        </span>
                    </div>
                </div>
            </div>

            {/* SECCIÓN RESUMEN RECIENTE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Últimas Haciendas Registradas
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Visualización rápida de los últimos registros
                        </p>
                    </div>

                    <Link
                        to="/haciendas"
                        className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold hover:underline"
                    >
                        Administrar todas →
                    </Link>
                </div>

                {cargando ? (
                    <div className="py-12">
                        <Spinner
                            size="md"
                            label="Obteniendo registros recientes..."
                        />
                    </div>
                ) : haciendasRecientes.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No hay haciendas para mostrar en este momento.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {haciendasRecientes.map((hacienda) => (
                            <div
                                key={hacienda.id}
                                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                        {hacienda.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">
                                            {hacienda.nombre}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {hacienda.ubicacion}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${hacienda.estatus === 'Activo'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${hacienda.estatus === 'Activo'
                                                ? 'bg-emerald-500'
                                                : 'bg-slate-400'
                                                }`}
                                        />
                                        {hacienda.estatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}