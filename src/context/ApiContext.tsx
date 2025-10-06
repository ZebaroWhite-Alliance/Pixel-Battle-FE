"use client"
import {createContext, useContext, useMemo, ReactNode} from "react"
import {ApiClient} from "@/services/ApiClient"

const ApiContext = createContext<ApiClient | null>(null)

export const ApiProvider = ({children}: { children: ReactNode }) => {
    const api = useMemo(() => new ApiClient(), []) // создаём один раз при монтировании
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export function useApi() {
    const context = useContext(ApiContext)
    if (!context) throw new Error("useApi must be used within ApiProvider")
    return context
}
