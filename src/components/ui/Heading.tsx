import React from 'react'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode
    className?: string
}

export default function Heading({ children, className = '', ...props }: HeadingProps) {
    return (
        <h2
            {...props}
            className={`text-lg font-bold text-gray-800 ${className}`}
        >
            {children}
        </h2>
    )
}
