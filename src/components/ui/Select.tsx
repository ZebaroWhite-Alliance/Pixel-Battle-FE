import React, {useState, useRef, useEffect} from "react"

interface Option<T = string> {
    label: string;
    value: T;
}

interface SelectProps<T = string> {
    value: T;
    options: Option<T>[];
    onChange: (v: T) => void;
    className?: string;
}

export default function NiceSelect<T = string>({value, options, onChange, className = ""}: SelectProps<T>) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    const selected = options.find(opt => opt.value === value)

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="w-full text-left px-3 py-2 rounded-lg border border-black/20 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm flex justify-between items-center"
            >
                <span>{selected?.label}</span>
                <span className={`ml-2 transform transition-transform ${open ? "rotate-180" : ""}`}>&#9662;</span>
            </button>

            {open && (
                <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border border-black/20 rounded-lg shadow-lg text-sm">
                    {options.map(opt => (
                        <li
                            key={String(opt.value)}
                            onClick={() => {
                                onChange(opt.value)
                                setOpen(false)
                            }}
                            className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${opt.value === value ? "bg-blue-50 font-semibold" : ""}`}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
