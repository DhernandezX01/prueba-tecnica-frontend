import { useState, useEffect } from 'react'
import Spinner from '../common/Spinner'
import ModalConfirmacion from '../common/ModalConfirmacion'

/**
 * Modal para interceptar la edición de una Hacienda,
 * con confirmación antes de guardar y antes de cancelar si hay cambios.
 */
export default function ModalEditarHacienda({
    isOpen,
    hacienda,
    cargando = false,
    onClose,
    onGuardar,
}) {
    const [nombre, setNombre] = useState('')
    const [ubicacion, setUbicacion] = useState('')
    const [estatus, setEstatus] = useState('Activo')
    const [errores, setErrores] = useState({ nombre: '', ubicacion: '' })

    // Modales internos de confirmación
    const [modalConfirmarGuardar, setModalConfirmarGuardar] = useState(false)
    const [datosParaGuardar, setDatosParaGuardar] = useState(null)
    const [modalConfirmarCancelar, setModalConfirmarCancelar] = useState(false)

    // Sincronizar datos de la hacienda seleccionada al abrir el modal
    useEffect(() => {
        if (hacienda) {
            setNombre(hacienda.nombre || '')
            setUbicacion(hacienda.ubicacion || '')
            setEstatus(hacienda.estatus || 'Activo')
            setErrores({ nombre: '', ubicacion: '' })
            setModalConfirmarGuardar(false)
            setModalConfirmarCancelar(false)
            setDatosParaGuardar(null)
        }
    }, [hacienda, isOpen])

    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                e.key === 'Escape' &&
                isOpen &&
                !cargando &&
                !modalConfirmarGuardar &&
                !modalConfirmarCancelar
            ) {
                solicitarCancelar()
            }
        }
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleKeyDown)
        }
        return () => {
            document.body.style.overflow = 'unset'
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, cargando, modalConfirmarGuardar, modalConfirmarCancelar])

    if (!isOpen || !hacienda) return null

    // Detectar si hay cambios respecto al original
    const hayCambios =
        nombre !== (hacienda.nombre || '') ||
        ubicacion !== (hacienda.ubicacion || '') ||
        estatus !== (hacienda.estatus || 'Activo')

    // ── VALIDAR Y PEDIR CONFIRMACIÓN DE GUARDADO ──
    const handleSubmit = (e) => {
        e.preventDefault()

        const nuevosErrores = { nombre: '', ubicacion: '' }
        let hayError = false

        if (!nombre.trim()) {
            nuevosErrores.nombre = 'El nombre de la hacienda es obligatorio'
            hayError = true
        }
        if (!ubicacion.trim()) {
            nuevosErrores.ubicacion = 'La ubicación geográfica es obligatoria'
            hayError = true
        }

        if (hayError) {
            setErrores(nuevosErrores)
            return
        }

        setDatosParaGuardar({
            nombre: nombre.trim(),
            ubicacion: ubicacion.trim(),
            estatus,
        })
        setModalConfirmarGuardar(true)
    }

    const handleConfirmarGuardar = () => {
        setModalConfirmarGuardar(false)
        onGuardar(hacienda.id, datosParaGuardar)
    }

    // ── CANCELAR ──
    const solicitarCancelar = () => {
        if (hayCambios) {
            setModalConfirmarCancelar(true)
        } else {
            onClose()
        }
    }

    const handleConfirmarCancelar = () => {
        setModalConfirmarCancelar(false)
        onClose()
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-editar-title"
                onClick={(e) => {
                    if (e.target === e.currentTarget && !cargando) {
                        solicitarCancelar()
                    }
                }}
            >
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                    {/* ENCABEZADO */}
                    <div className="flex items-start justify-between pb-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 ring-4 ring-amber-500/10">
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3
                                    id="modal-editar-title"
                                    className="text-lg font-bold text-slate-800"
                                >
                                    Editar Información
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Actualice los datos de la hacienda seleccionada
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={cargando}
                            onClick={solicitarCancelar}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors -mr-1 -mt-1 disabled:opacity-50"
                            aria-label="Cerrar modal"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* FORMULARIO */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                        {/* NOMBRE */}
                        <div>
                            <label
                                htmlFor="modal-nombre"
                                className="block text-sm font-semibold text-slate-700 mb-1.5"
                            >
                                Nombre de la Hacienda <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="modal-nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value)
                                    if (errores.nombre)
                                        setErrores((prev) => ({ ...prev, nombre: '' }))
                                }}
                                placeholder="Ej. Hacienda El Roble"
                                className={`w-full bg-slate-50/70 border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                    errores.nombre
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500/10'
                                }`}
                            />
                            {errores.nombre && (
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
                                    {errores.nombre}
                                </p>
                            )}
                        </div>

                        {/* UBICACIÓN */}
                        <div>
                            <label
                                htmlFor="modal-ubicacion"
                                className="block text-sm font-semibold text-slate-700 mb-1.5"
                            >
                                Ubicación <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="modal-ubicacion"
                                type="text"
                                value={ubicacion}
                                onChange={(e) => {
                                    setUbicacion(e.target.value)
                                    if (errores.ubicacion)
                                        setErrores((prev) => ({ ...prev, ubicacion: '' }))
                                }}
                                placeholder="Ej. Santa Ana, Valle de Zapotitán"
                                className={`w-full bg-slate-50/70 border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                    errores.ubicacion
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500/10'
                                }`}
                            />
                            {errores.ubicacion && (
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
                                    {errores.ubicacion}
                                </p>
                            )}
                        </div>

                        {/* ESTATUS */}
                        <div>
                            <label
                                htmlFor="modal-estatus"
                                className="block text-sm font-semibold text-slate-700 mb-1.5"
                            >
                                Estatus Operativo
                            </label>
                            <select
                                id="modal-estatus"
                                value={estatus}
                                onChange={(e) => setEstatus(e.target.value)}
                                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
                            >
                                <option value="Activo">🟢 Activo</option>
                                <option value="Inactivo">⚪ Inactivo</option>
                            </select>
                        </div>

                        {/* BOTONES DE ACCIÓN */}
                        <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                disabled={cargando}
                                onClick={solicitarCancelar}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={cargando}
                                className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm shadow-amber-600/20 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-75"
                            >
                                {cargando && <Spinner size="xs" color="white" inline />}
                                <span>{cargando ? 'Guardando cambios...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* CONFIRMACIÓN GUARDAR */}
            <ModalConfirmacion
                isOpen={modalConfirmarGuardar}
                onClose={() => setModalConfirmarGuardar(false)}
                onConfirm={handleConfirmarGuardar}
                cargando={cargando}
                tipo="warning"
                titulo="¿Guardar cambios?"
                mensaje={
                    <div>
                        <p>
                            ¿Estás seguro de que deseas guardar los cambios en la hacienda{' '}
                            <strong className="text-slate-900">
                                &quot;{datosParaGuardar?.nombre}&quot;
                            </strong>
                            ? Esta acción actualizará la información en el sistema.
                        </p>
                    </div>
                }
                textoConfirmar="Sí, guardar cambios"
                textoCancelar="Revisar datos"
            />

            {/* CONFIRMACIÓN CANCELAR */}
            <ModalConfirmacion
                isOpen={modalConfirmarCancelar}
                onClose={() => setModalConfirmarCancelar(false)}
                onConfirm={handleConfirmarCancelar}
                tipo="warning"
                titulo="¿Descartar cambios?"
                mensaje={
                    <p>
                        Tienes cambios sin guardar. ¿Estás seguro de que deseas salir sin guardar
                        la edición de la hacienda?
                    </p>
                }
                textoConfirmar="Sí, descartar cambios"
                textoCancelar="Continuar editando"
            />
        </>
    )
}
