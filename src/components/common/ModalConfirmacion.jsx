import { useEffect } from 'react'
import Spinner from './Spinner'

/**
 * Modal de Confirmación para prevención de errores en acciones destructivas
 */
export default function ModalConfirmacion({
    isOpen,
    onClose,
    onConfirm,
    titulo = '¿Confirmar acción?',
    mensaje = '¿Está seguro de que desea continuar? Esta acción no se puede deshacer.',
    textoConfirmar = 'Eliminar',
    textoCancelar = 'Cancelar',
    tipo = 'danger', // 'danger' | 'warning' | 'info'
    cargando = false,
}) {
    // Cerrar con la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !cargando) {
                onClose()
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
    }, [isOpen, cargando, onClose])

    if (!isOpen) return null

    const iconConfig = {
        danger: {
            bg: 'bg-red-100 text-red-600',
            btn: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            ),
        },
        warning: {
            bg: 'bg-amber-100 text-amber-600',
            btn: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            ),
        },
        info: {
            bg: 'bg-blue-100 text-blue-600',
            btn: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
    }

    const currentConfig = iconConfig[tipo] || iconConfig.danger

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-confirm-title"
            onClick={(e) => {
                if (e.target === e.currentTarget && !cargando) {
                    onClose()
                }
            }}
        >
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentConfig.bg}`}
                    >
                        {currentConfig.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3
                            id="modal-confirm-title"
                            className="text-lg font-bold text-slate-800"
                        >
                            {titulo}
                        </h3>
                        <div className="mt-2 text-sm text-slate-600 leading-relaxed">
                            {mensaje}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        disabled={cargando}
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
                    >
                        {textoCancelar}
                    </button>

                    <button
                        type="button"
                        disabled={cargando}
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-75 ${currentConfig.btn}`}
                    >
                        {cargando && <Spinner size="xs" color="white" inline />}
                        <span>{cargando ? 'Procesando...' : textoConfirmar}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
