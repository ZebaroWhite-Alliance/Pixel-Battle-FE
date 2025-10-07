import React, {useState} from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({label, error, className = '', value, onChange, ...props}: InputProps) {
    const [internalValue, setInternalValue] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e)
        else setInternalValue(e.target.value)
    }

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                {...props}
                value={internalValue || value}
                onChange={handleChange}
                className={`mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-white bg-opacity-80 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
            />
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    );
};
