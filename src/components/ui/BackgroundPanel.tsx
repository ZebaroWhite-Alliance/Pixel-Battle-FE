import React from 'react'

type BackgroundPanelProps = React.HTMLAttributes<HTMLDivElement>

export default function BackgroundPanel({className = '', children, ...props}: BackgroundPanelProps) {
    return (
        <div
            {...props}
            className={`
                p-2 
                rounded-xl 
                shadow-sm 
                border border-black/10 
                bg-[#fafafa]
                ${className}
            `}
        >
            {children}
        </div>
    )
}
