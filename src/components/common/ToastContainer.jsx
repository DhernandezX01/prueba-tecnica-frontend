/**
 * Contenedor y tarjetas para notificaciones Toast
 */
export default function ToastContainer({ toasts, onDismiss }) {
    if (!toasts || toasts.length === 0) return null

    const iconMap = {
        success: (
            <svg
                className="w-5 h-5 text-emerald-500 flex-shrink-0"
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
        ),
        error: (
            <svg
                className="w-5 h-5 text-red-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
        warning: (
            <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0"
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
        info: (
            <svg
                className="w-5 h-5 text-blue-500 flex-shrink-0"
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
    }

    const borderMap = {
        success: 'border-l-4 border-l-emerald-500',
        error: 'border-l-4 border-l-red-500',
        warning: 'border-l-4 border-l-amber-500',
        info: 'border-l-4 border-l-blue-500',
    }

    return (
        <aside
            aria-label="Notificaciones del sistema"
            className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role="alert"
                    className={`pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg shadow-slate-900/5 border border-slate-200/80 transition-all duration-300 transform translate-y-0 opacity-100 ${borderMap[toast.type] || borderMap.info}`}
                >
                    <div className="pt-0.5">{iconMap[toast.type] || iconMap.info}</div>

                    <div className="flex-1 min-w-0">
                        {toast.title && (
                            <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                                {toast.title}
                            </h4>
                        )}
                        <p className="text-xs text-slate-600 mt-0.5 break-words leading-relaxed">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onDismiss(toast.id)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors -mr-1 -mt-1"
                        aria-label="Cerrar notificación"
                    >
                        <svg
                            className="w-4 h-4"
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
            ))}
        </aside>
    )
}
