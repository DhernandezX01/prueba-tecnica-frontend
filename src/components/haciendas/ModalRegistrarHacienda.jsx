import { useState, useEffect } from 'react'
import Spinner from '../common/Spinner'
import ModalConfirmacion from '../common/ModalConfirmacion'

/**
 * Modal para registrar una nueva Hacienda con confirmación antes de guardar
 */
export default function ModalRegistrarHacienda({
    isOpen,
    guardando = false,
    onClose,
    onGuardar,
}) {
    const [nombre, setNombre] = useState('')
    const [ubicacion, setUbicacion] = useState('')
    const [estatus, setEstatus] = useState('Activo')
    const [errores, setErrores] = useState({ nombre: '', ubicacion: '' })

    // Modal de confirmación de guardado
    const [modalConfirmarGuardar, setModalConfirmarGuardar] = useState(false)
    const [datosParaGuardar, setDatosParaGuardar] = useState(null)

    // Modal de confirmación de cancelación
    const [modalConfirmarCancelar, setModalConfirmarCancelar] = useState(false)

    // Reset al abrir
    useEffect(() => {
        if (isOpen) {
            setNombre('')
            setUbicacion('')
            setEstatus('Activo')
            setErrores({ nombre: '', ubicacion: '' })
            setModalConfirmarGuardar(false)
            setModalConfirmarCancelar(false)
            setDatosParaGuardar(null)
        }
    }, [isOpen])

    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                e.key === 'Escape' &&
                isOpen &&
                !guardando &&
                !modalConfirmarGuardar &&
                !modalConfirmarCancelar
            ) {
                handleSolicitarCancelar()
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
    }, [isOpen, guardando, modalConfirmarGuardar, modalConfirmarCancelar])

    if (!isOpen) return null

    // ── VALIDAR Y MOSTRAR CONFIRMACIÓN DE GUARDADO ──
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

    const handleConfirmarGuardar = async () => {
        setModalConfirmarGuardar(false)
        await onGuardar(datosParaGuardar)
    }

    // ── CANCELAR ──
    const handleSolicitarCancelar = () => {
        const hayDatos = nombre.trim() || ubicacion.trim()
        if (hayDatos) {
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
                aria-labelledby="modal-registrar-title"
                onClick={(e) => {
                    if (e.target === e.currentTarget && !guardando) {
                        handleSolicitarCancelar()
                    }
                }}
            >
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                    {/* ENCABEZADO */}
                    <div className="flex items-start justify-between pb-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 ring-4 ring-emerald-500/10">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <h3 id="modal-registrar-title" className="text-lg font-bold text-slate-800">
                                    Registrar Nueva Hacienda
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Complete los campos para dar de alta una nueva hacienda
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={guardando}
                            onClick={handleSolicitarCancelar}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors -mr-1 -mt-1 disabled:opacity-50"
                            aria-label="Cerrar modal"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* FORMULARIO */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                        {/* NOMBRE */}
                        <div>
                            <label htmlFor="reg-nombre" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Nombre de la Hacienda <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="reg-nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value)
                                    if (errores.nombre) setErrores((prev) => ({ ...prev, nombre: '' }))
                                }}
                                placeholder="Ej. Hacienda El Roble"
                                className={`w-full bg-slate-50/70 border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                    errores.nombre
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/10'
                                }`}
                            />
                            {errores.nombre && (
                                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errores.nombre}
                                </p>
                            )}
                        </div>

                        {/* UBICACIÓN */}
                        <div>
                            <label htmlFor="reg-ubicacion" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Ubicación <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="reg-ubicacion"
                                type="text"
                                value={ubicacion}
                                onChange={(e) => {
                                    setUbicacion(e.target.value)
                                    if (errores.ubicacion) setErrores((prev) => ({ ...prev, ubicacion: '' }))
                                }}
                                placeholder="Ej. Santa Ana, Valle de Zapotitán"
                                className={`w-full bg-slate-50/70 border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                    errores.ubicacion
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/10'
                                }`}
                            />
                            {errores.ubicacion && (
                                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errores.ubicacion}
                                </p>
                            )}
                        </div>

                        {/* ESTATUS */}
                        <div>
                            <label htmlFor="reg-estatus" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Estatus Operativo
                            </label>
                            <select
                                id="reg-estatus"
                                value={estatus}
                                onChange={(e) => setEstatus(e.target.value)}
                                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 cursor-pointer"
                            >
                                <option value="Activo">🟢 Activo</option>
                                <option value="Inactivo">⚪ Inactivo</option>
                            </select>
                        </div>

                        {/* BOTONES */}
                        <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                disabled={guardando}
                                onClick={handleSolicitarCancelar}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={guardando}
                                className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-75"
                            >
                                {guardando && <Spinner size="xs" color="white" inline />}
                                <span>{guardando ? 'Guardando...' : 'Registrar Hacienda'}</span>
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
                cargando={guardando}
                tipo="info"
                titulo="¿Registrar hacienda?"
                mensaje={
                    <div>
                        <p>
                            ¿Estás seguro de que deseas registrar la hacienda{' '}
                            <strong className="text-slate-900">
                                &quot;{datosParaGuardar?.nombre}&quot;
                            </strong>{' '}
                            ubicada en{' '}
                            <span className="text-slate-700">{datosParaGuardar?.ubicacion}</span>?
                        </p>
                        <p className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                            ✅ Se guardará como nueva hacienda en el sistema.
                        </p>
                    </div>
                }
                textoConfirmar="Sí, registrar hacienda"
                textoCancelar="Revisar datos"
            />

            {/* CONFIRMACIÓN CANCELAR */}
            <ModalConfirmacion
                isOpen={modalConfirmarCancelar}
                onClose={() => setModalConfirmarCancelar(false)}
                onConfirm={handleConfirmarCancelar}
                tipo="warning"
                titulo="¿Cancelar registro?"
                mensaje={
                    <p>
                        Tienes datos ingresados que aún no han sido guardados. ¿Estás seguro de que
                        deseas salir sin registrar la hacienda?
                    </p>
                }
                textoConfirmar="Sí, descartar datos"
                textoCancelar="Continuar editando"
            />
        </>
    )
}
