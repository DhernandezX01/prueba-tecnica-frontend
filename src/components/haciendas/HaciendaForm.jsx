import { useState, useEffect } from 'react'
import Spinner from '../common/Spinner'

/**
 * Formulario modular para creación y edición de Haciendas
 */
export default function HaciendaForm({
    initialValues = { nombre: '', ubicacion: '', estatus: 'Activo' },
    editando = false,
    guardando = false,
    onSubmit,
    onCancel,
}) {
    const [nombre, setNombre] = useState(initialValues.nombre || '')
    const [ubicacion, setUbicacion] = useState(initialValues.ubicacion || '')
    const [estatus, setEstatus] = useState(initialValues.estatus || 'Activo')

    const [errores, setErrores] = useState({ nombre: '', ubicacion: '' })

    // Sincronizar formulario cuando cambian initialValues (por ejemplo al presionar editar)
    useEffect(() => {
        setNombre(initialValues.nombre || '')
        setUbicacion(initialValues.ubicacion || '')
        setEstatus(initialValues.estatus || 'Activo')
        setErrores({ nombre: '', ubicacion: '' })
    }, [initialValues])

    const handleSubmit = async (e) => {
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

        const exito = await onSubmit({
            nombre: nombre.trim(),
            ubicacion: ubicacion.trim(),
            estatus,
        })

        if (exito !== false && !editando) {
            setNombre('')
            setUbicacion('')
            setEstatus('Activo')
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 transition-all">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            editando
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-emerald-50 text-emerald-600'
                        }`}
                    >
                        {editando ? (
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
                        ) : (
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {editando ? 'Editar Hacienda' : 'Registrar Nueva Hacienda'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {editando
                                ? 'Actualice la información de la hacienda seleccionada'
                                : 'Complete los campos para dar de alta una nueva hacienda'}
                        </p>
                    </div>
                </div>

                {editando && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        Modo edición
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* NOMBRE */}
                    <div>
                        <label
                            htmlFor="hacienda-nombre"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            Nombre de la Hacienda <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="hacienda-nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value)
                                    if (errores.nombre)
                                        setErrores((prev) => ({ ...prev, nombre: '' }))
                                }}
                                placeholder="Ej. Hacienda El Roble"
                                className={`w-full bg-slate-50/50 rounded-xl px-4 py-3 text-slate-800 text-sm border outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 ${
                                    errores.nombre
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-slate-300 focus:border-emerald-600'
                                }`}
                            />
                        </div>
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
                            htmlFor="hacienda-ubicacion"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            Ubicación <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="hacienda-ubicacion"
                                type="text"
                                value={ubicacion}
                                onChange={(e) => {
                                    setUbicacion(e.target.value)
                                    if (errores.ubicacion)
                                        setErrores((prev) => ({
                                            ...prev,
                                            ubicacion: '',
                                        }))
                                }}
                                placeholder="Ej. Santa Ana, Valle de Zapotitán"
                                className={`w-full bg-slate-50/50 rounded-xl px-4 py-3 text-slate-800 text-sm border outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 ${
                                    errores.ubicacion
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-slate-300 focus:border-emerald-600'
                                }`}
                            />
                        </div>
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
                            htmlFor="hacienda-estatus"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            Estatus Operativo
                        </label>
                        <select
                            id="hacienda-estatus"
                            value={estatus}
                            onChange={(e) => setEstatus(e.target.value)}
                            className="w-full bg-slate-50/50 rounded-xl px-4 py-3 text-slate-800 text-sm border border-slate-300 outline-none transition-all focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 cursor-pointer"
                        >
                            <option value="Activo">🟢 Activo</option>
                            <option value="Inactivo">⚪ Inactivo</option>
                        </select>
                    </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={guardando}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all shadow-sm active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed ${
                            editando
                                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                        }`}
                    >
                        {guardando && <Spinner size="xs" color="white" inline />}
                        <span>
                            {guardando
                                ? editando
                                    ? 'Actualizando...'
                                    : 'Guardando...'
                                : editando
                                  ? 'Guardar Cambios'
                                  : 'Registrar Hacienda'}
                        </span>
                    </button>

                    {editando && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={guardando}
                            className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-medium text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            Cancelar edición
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
