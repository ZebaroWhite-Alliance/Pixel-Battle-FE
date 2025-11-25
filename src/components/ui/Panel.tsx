import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function Panel({children, className = '', style, ...props}: PanelProps) {
    return (
        <div
            {...props}
            style={style}
            className={`
                bg-white bg-opacity-80 backdrop-blur-md
                shadow-md rounded-xl
                px-3 py-3
                flex gap-2
                ${className}
            `}
        >
            {children}
        </div>
    );
}
