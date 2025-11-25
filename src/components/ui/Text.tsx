import React from 'react'

interface TextProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode
    className?: string
}

export default function Text({ children, className = '', ...props }: TextProps) {
    return (
        <div
            {...props}
            className={`text-gray-800 font-medium text-sm ${className}`}
        >
            {children}
        </div>
    )
}
