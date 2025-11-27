import React from "react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    color?: string;
    size?: number;
    loading?: boolean;
}

export default function Checkbox({
                                     label,
                                     color,
                                     size = 20,
                                     loading = false,
                                     className = "",
                                     disabled,
                                     ...props
                                 }: CheckboxProps) {
    const finalDisabled = disabled || loading

    return (
        <label className="flex items-center gap-2 select-none cursor-pointer">
            <div
                className={`
                    flex items-center justify-center rounded
                    border transition-all duration-200
                    ${finalDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${props.checked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}
                    ${className}
                `}
                style={{
                    width: size,
                    height: size,
                    borderColor: color || undefined,
                    backgroundColor: props.checked && color ? color : undefined,
                }}
            >
                {loading ? (
                    <div className="w-3 h-3 animate-spin border-2 border-white border-t-transparent rounded-full"/>
                ) : props.checked ? (
                    <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                ) : null}
            </div>

            <input
                {...props}
                type="checkbox"
                disabled={finalDisabled}
                className="hidden"
            />

            {label && <span className={`${finalDisabled ? "opacity-50" : ""}`}>{label}</span>}
        </label>
    )
}
