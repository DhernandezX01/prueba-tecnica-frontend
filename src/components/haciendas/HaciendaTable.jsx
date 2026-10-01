import { useState, useMemo } from 'react'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

/**
 * Tabla modular para listar haciendas con buscador, filtros y acciones
 */
export default function HaciendaTable({
    haciendas = [],
    cargando = false,
    onEditar,
    onSolicitarEliminar,
    onRegistrarClick,
}) {
    const [busqueda, setBusqueda] = useState('')
    const [filtroEstatus, setFiltroEstatus] = useState('Todos')

    // ── FILTRADO REACTIVO ──
    const haciendasFiltradas = useMemo(() => {
        return haciendas.filter((h) => {
            const termino = busqueda.toLowerCase().trim()
            const coincideTexto =
                !termino ||
                h.nombre.toLowerCase().includes(termino) ||
                h.ubicacion.toLowerCase().includes(termino)
            const coincideEstatus =
                filtroEstatus === 'Todos' || h.estatus === filtroEstatus
            return coincideTexto && coincideEstatus
        })
    }, [haciendas, busqueda, filtroEstatus])

    const limpiarFiltros = () => {
        setBusqueda('')
        setFiltroEstatus('Todos')
    }

    const hayFiltrosActivos = busqueda.trim() !== '' || filtroEstatus !== 'Todos'

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            {/* ENCABEZADO DE LA TARJETA */}
            <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Listado de Haciendas</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {haciendas.length === 1
                                ? '1 hacienda registrada'
                                : `${haciendas.length} haciendas registradas en total`}
                            {hayFiltrosActivos && (
                                <span className="ml-1 text-emerald-600 font-semibold">
                                    {' '}· {haciendasFiltradas.length} resultado
                                    {haciendasFiltradas.length !== 1 ? 's' : ''} encontrado
                                    {haciendasFiltradas.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* BARRA DE BÚSQUEDA Y FILTROS */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Buscador de texto */}
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                            <svg
                                className="w-4 h-4 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                                />
                            </svg>
                        </div>
                        <input
                            id="hacienda-busqueda"
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por nombre o ubicación..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                        {busqueda && (
                            <button
                                type="button"
                                onClick={() => setBusqueda('')}
                                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Limpiar búsqueda"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filtro de estatus */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                            <svg
                                className="w-4 h-4 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                                />
                            </svg>
                        </div>
                        <select
                            id="hacienda-filtro-estatus"
                            value={filtroEstatus}
                            onChange={(e) => setFiltroEstatus(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 cursor-pointer"
                        >
                            <option value="Todos">Todos los estatus</option>
                            <option value="Activo">🟢 Activo</option>
                            <option value="Inactivo">⚪ Inactivo</option>
                        </select>
                    </div>

                    {/* Botón limpiar filtros */}
                    {hayFiltrosActivos && (
                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 whitespace-nowrap"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENIDO: SPINNER / EMPTY STATE / TABLA */}
            {cargando ? (
                <div className="py-16">
                    <Spinner size="lg" label="Cargando el listado de haciendas..." color="primary" />
                </div>
            ) : haciendas.length === 0 ? (
                <EmptyState
                    titulo="No hay haciendas registradas"
                    mensaje="Actualmente no existe ninguna hacienda en el sistema. Registra la primera para comenzar a administrarla."
                    accion={onRegistrarClick}
                    textoAccion="Registrar Hacienda"
                />
            ) : haciendasFiltradas.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-slate-500">
                    <svg
                        className="w-10 h-10 text-slate-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                        />
                    </svg>
                    <div className="text-center">
                        <p className="font-semibold text-slate-700">Sin resultados</p>
                        <p className="text-sm mt-1 text-slate-500">
                            No se encontraron haciendas con los filtros aplicados.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={limpiarFiltros}
                        className="mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200/80">
                                <th className="px-6 py-4">Hacienda</th>
                                <th className="px-6 py-4">Ubicación</th>
                                <th className="px-6 py-4">Estatus</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {haciendasFiltradas.map((hacienda) => {
                                const esActivo = hacienda.estatus === 'Activo'
                                return (
                                    <tr
                                        key={hacienda.id}
                                        className="hover:bg-slate-50/70 transition-colors group"
                                    >
                                        {/* NOMBRE */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {hacienda.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-slate-800">
                                                    {hacienda.nombre}
                                                </span>
                                            </div>
                                        </td>

                                        {/* UBICACIÓN */}
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <svg
                                                    className="w-4 h-4 text-slate-400 shrink-0"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                <span>{hacienda.ubicacion}</span>
                                            </div>
                                        </td>

                                        {/* ESTATUS BADGE */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    esActivo
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        esActivo
                                                            ? 'bg-emerald-500 animate-pulse'
                                                            : 'bg-slate-400'
                                                    }`}
                                                />
                                                {hacienda.estatus}
                                            </span>
                                        </td>

                                        {/* ACCIONES */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onEditar(hacienda)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 transition-colors border border-amber-200/60"
                                                    title="Editar hacienda"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span>Editar</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onSolicitarEliminar(hacienda)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 transition-colors border border-red-200/60"
                                                    title="Eliminar hacienda"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span>Eliminar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
