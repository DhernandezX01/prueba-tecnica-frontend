import { createContext, useContext, useState, useCallback } from 'react'
import ToastContainer from '../components/common/ToastContainer'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const addToast = useCallback(
        ({ type = 'info', title, message, duration = 4000 }) => {
            const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

            const nuevoToast = {
                id,
                type,
                title:
                    title ||
                    (type === 'success'
                        ? 'Éxito'
                        : type === 'error'
                          ? 'Error'
                          : type === 'warning'
                            ? 'Advertencia'
                            : 'Información'),
                message,
                duration,
            }

            setToasts((prev) => [...prev, nuevoToast])

            if (duration > 0) {
                setTimeout(() => {
                    dismissToast(id)
                }, duration)
            }

            return id
        },
        [dismissToast]
    )

    const toast = {
        success: (message, title) =>
            addToast({ type: 'success', message, title }),
        error: (message, title) =>
            addToast({ type: 'error', message, title }),
        warning: (message, title) =>
            addToast({ type: 'warning', message, title }),
        info: (message, title) =>
            addToast({ type: 'info', message, title }),
        dismiss: dismissToast,
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast debe ser utilizado dentro de un ToastProvider')
    }
    return context
}
