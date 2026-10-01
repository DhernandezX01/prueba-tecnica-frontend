/**
 * Componente EmptyState para estados vacíos de listas y tablas
 */
export default function EmptyState({
    titulo = 'No hay registros disponibles',
    mensaje = 'No se encontraron elementos para mostrar en este momento.',
    icono,
    accion,
    textoAccion = 'Agregar elemento',
}) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
                {icono || (
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                )}
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {titulo}
            </h3>

            <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                {mensaje}
            </p>

            {accion && (
                <button
                    type="button"
                    onClick={accion}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
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
                    <span>{textoAccion}</span>
                </button>
            )}
        </div>
    )
}
