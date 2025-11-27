import React from 'react'

type OptionProps = React.OptionHTMLAttributes<HTMLOptionElement>

export default function Option({ children, ...props }: OptionProps) {
    return (
        <option
            {...props}
            className="text-gray-800 bg-white"
        >
            {children}
        </option>
    )
}
