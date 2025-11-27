import React from 'react'

interface ErrorFieldProps {
    message?: string;
    className?: string;
}

export default function ErrorField({message, className = ''}: ErrorFieldProps) {
    if (!message) return null

    return (
        <div className={`text-red-500 font-medium mt-2 ${className}`}>
            {message}
        </div>
    )
}
