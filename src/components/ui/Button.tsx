import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    color?: string;
}

export default function Button({children, loading, color, className = '', ...props}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            style={color ? { backgroundColor: color } : undefined}
            className={`px-4 py-2 font-semibold rounded-xl shadow-xl hover:scale-105 transition-transform text-sm
                ${!color ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-white'}
                ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}
                ${className}`}
        >
            {loading ? 'Loading...' : children}
        </button>
    )
};
