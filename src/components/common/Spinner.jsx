/**
 * Componente Spinner reutilizable con soporte de tamaños y colores
 */
export default function Spinner({
    size = 'md',
    color = 'primary',
    className = '',
    label = 'Cargando...',
    inline = false,
}) {
    const sizeClasses = {
        xs: 'w-3.5 h-3.5 border-2',
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-10 h-10 border-3',
        xl: 'w-14 h-14 border-4',
    }

    const colorClasses = {
        primary: 'border-emerald-600 border-t-transparent text-emerald-600',
        white: 'border-white border-t-transparent text-white',
        blue: 'border-blue-600 border-t-transparent text-blue-600',
        gray: 'border-slate-400 border-t-transparent text-slate-500',
    }

    const spinnerContent = (
        <div
            className={`inline-block animate-spin rounded-full border-solid ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary} ${className}`}
            role="status"
            aria-label={label}
        >
            <span className="sr-only">{label}</span>
        </div>
    )

    if (inline) {
        return spinnerContent
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-6 text-slate-500">
            {spinnerContent}
            {label && <span className="text-sm font-medium">{label}</span>}
        </div>
    )
}
