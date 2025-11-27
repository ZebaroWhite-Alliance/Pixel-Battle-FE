import {useCallback, useState, ChangeEvent} from "react"

export default function useForm<T extends Record<string, any>>(initial: T) {
    const [values, setValues] = useState(initial)

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setValues(prev => ({...prev, [name]: value}))
    }, [])

    return {values, handleChange, setValues}
}