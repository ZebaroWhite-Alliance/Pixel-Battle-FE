import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export default function Button({children, loading, className = '', ...props}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`px-4 py-2 font-semibold rounded-xl shadow-lg hover:scale-105 transform transition ${
                loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            } ${className}`}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};
