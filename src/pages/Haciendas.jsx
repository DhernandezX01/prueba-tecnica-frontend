import { useEffect, useState, useCallback } from 'react'
import haciendasService from '../services/haciendasService'
import { useToast } from '../hooks/useToast'
import HaciendaTable from '../components/haciendas/HaciendaTable'
import ModalConfirmacion from '../components/common/ModalConfirmacion'
import ModalEditarHacienda from '../components/haciendas/ModalEditarHacienda'
import ModalRegistrarHacienda from '../components/haciendas/ModalRegistrarHacienda'

export default function Haciendas() {
    const toast = useToast()

    // Estados de datos
    const [haciendas, setHaciendas] = useState([])

    // Estados de carga (UX)
    const [cargando, setCargando] = useState(true)
    const [guardandoNuevo, setGuardandoNuevo] = useState(false)
    const [guardandoEdicion, setGuardandoEdicion] = useState(false)
    const [eliminando, setEliminando] = useState(false)

    // Estado del Modal de Registro
    const [modalRegistrarAbierto, setModalRegistrarAbierto] = useState(false)

    // Estado del Modal de Edición
    const [haciendaEditar, setHaciendaEditar] = useState(null)
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

    // Estado del Modal de Confirmación de Eliminación
    const [haciendaAEliminar, setHaciendaAEliminar] = useState(null)
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)

    // =====================================
    // CARGAR HACIENDAS
    // =====================================
    const cargarHaciendas = useCallback(async () => {
        try {
            setCargando(true)
            const data = await haciendasService.obtenerTodas()
            setHaciendas(data)
        } catch (error) {
            console.error('Error al cargar haciendas:', error)
            toast.error(
                error.message || 'No se pudieron cargar las haciendas',
                'Error de conexión'
            )
        } finally {
            setCargando(false)
        }
    }, [toast])

    useEffect(() => {
        cargarHaciendas()
    }, [cargarHaciendas])

    // =====================================
    // REGISTRAR NUEVA HACIENDA (MODAL)
    // =====================================
    const handleCrearHacienda = async (datos) => {
        try {
            setGuardandoNuevo(true)
            await haciendasService.crear(datos)

            toast.success(
                `La hacienda "${datos.nombre}" ha sido registrada exitosamente`,
                'Hacienda creada'
            )

            setModalRegistrarAbierto(false)
            await cargarHaciendas()
            return true
        } catch (error) {
            console.error('Error al crear hacienda:', error)
            toast.error(
                error.message || 'Ocurrió un error al registrar la hacienda',
                'Error al crear'
            )
            return false
        } finally {
            setGuardandoNuevo(false)
        }
    }

    // =====================================
    // INTERCEPTAR Y GESTIONAR EDICIÓN (MODAL)
    // =====================================
    const handleIniciarEdicion = (hacienda) => {
        setHaciendaEditar(hacienda)
        setModalEditarAbierto(true)
    }

    const handleCerrarModalEditar = () => {
        if (!guardandoEdicion) {
            setModalEditarAbierto(false)
            setHaciendaEditar(null)
        }
    }

    const handleGuardarEdicion = async (id, datosActualizados) => {
        try {
            setGuardandoEdicion(true)
            await haciendasService.actualizar(id, datosActualizados)

            toast.success(
                `La hacienda "${datosActualizados.nombre}" ha sido actualizada con éxito`,
                'Hacienda actualizada'
            )

            setModalEditarAbierto(false)
            setHaciendaEditar(null)
            await cargarHaciendas()
        } catch (error) {
            console.error('Error al actualizar hacienda:', error)
            toast.error(
                error.message || 'No se pudo actualizar la información de la hacienda',
                'Error al actualizar'
            )
        } finally {
            setGuardandoEdicion(false)
        }
    }

    // =====================================
    // INTERCEPTAR Y GESTIONAR ELIMINACIÓN (MODAL)
    // =====================================
    const handleSolicitarEliminar = (hacienda) => {
        setHaciendaAEliminar(hacienda)
        setModalEliminarAbierto(true)
    }

    const handleCerrarModalEliminar = () => {
        if (!eliminando) {
            setModalEliminarAbierto(false)
            setHaciendaAEliminar(null)
        }
    }

    const handleConfirmarEliminacion = async () => {
        if (!haciendaAEliminar) return

        try {
            setEliminando(true)
            await haciendasService.eliminar(haciendaAEliminar.id)

            toast.success(
                `La hacienda "${haciendaAEliminar.nombre}" fue eliminada del sistema`,
                'Hacienda eliminada'
            )

            setModalEliminarAbierto(false)
            setHaciendaAEliminar(null)

            await cargarHaciendas()
        } catch (error) {
            console.error('Error al eliminar hacienda:', error)
            toast.error(
                error.message || 'No fue posible eliminar la hacienda seleccionada',
                'Error al eliminar'
            )
        } finally {
            setEliminando(false)
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* ENCABEZADO DE PÁGINA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Gestión de Haciendas
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Control, registro y administración de haciendas agrícolas
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* BOTÓN RECARGAR */}
                    <button
                        type="button"
                        onClick={cargarHaciendas}
                        disabled={cargando}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
                        title="Actualizar listado"
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
                        <span>{cargando ? 'Actualizando...' : 'Recargar datos'}</span>
                    </button>

                    {/* BOTÓN REGISTRAR HACIENDA */}
                    <button
                        type="button"
                        onClick={() => setModalRegistrarAbierto(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-600/25 active:scale-95"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Registrar Hacienda</span>
                    </button>
                </div>
            </div>

            {/* TABLA DE HACIENDAS */}
            <HaciendaTable
                haciendas={haciendas}
                cargando={cargando}
                onEditar={handleIniciarEdicion}
                onSolicitarEliminar={handleSolicitarEliminar}
                onRegistrarClick={() => setModalRegistrarAbierto(true)}
            />

            {/* MODAL PARA REGISTRAR HACIENDA */}
            <ModalRegistrarHacienda
                isOpen={modalRegistrarAbierto}
                guardando={guardandoNuevo}
                onClose={() => setModalRegistrarAbierto(false)}
                onGuardar={handleCrearHacienda}
            />

            {/* MODAL PARA EDITAR HACIENDA */}
            <ModalEditarHacienda
                isOpen={modalEditarAbierto}
                hacienda={haciendaEditar}
                cargando={guardandoEdicion}
                onClose={handleCerrarModalEditar}
                onGuardar={handleGuardarEdicion}
            />

            {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
            <ModalConfirmacion
                isOpen={modalEliminarAbierto}
                onClose={handleCerrarModalEliminar}
                onConfirm={handleConfirmarEliminacion}
                cargando={eliminando}
                tipo="danger"
                titulo="¿Eliminar esta Hacienda?"
                mensaje={
                    <div>
                        <p>
                            ¿Estás seguro de que deseas eliminar permanentemente la hacienda{' '}
                            <strong className="text-slate-900 font-semibold">
                                &quot;{haciendaAEliminar?.nombre}&quot;
                            </strong>
                            {haciendaAEliminar?.ubicacion ? (
                                <>
                                    {' '}
                                    ubicada en{' '}
                                    <span className="text-slate-700">
                                        {haciendaAEliminar.ubicacion}
                                    </span>
                                </>
                            ) : null}
                            ?
                        </p>
                        <p className="mt-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                            ⚠️ Esta acción es irreversible y eliminará todos los registros asociados
                            en la base de datos.
                        </p>
                    </div>
                }
                textoConfirmar="Sí, eliminar hacienda"
                textoCancelar="Cancelar"
            />
        </div>
    )
}