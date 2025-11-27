"use client"
import React, {createContext, useContext, useEffect, useState} from 'react'

import Heading from "@/components/ui/Heading"
import Panel from "@/components/ui/Panel"
import AppServices from '@/services/AppServices'

const ServicesContext = createContext<AppServices | null>(null)

export function ServicesProvider({children}: { children: React.ReactNode }) {
    const [services, setServices] = useState<AppServices | null>(null)

    useEffect(() => {
        const appServices = new AppServices()
        setServices(appServices)
    }, [])

    if (!services) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center">
            <Panel className="flex-col items-center justify-center">
                <Heading>Loading...</Heading>

                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </Panel>
        </div>)
    }

    return (
        <ServicesContext.Provider value={services}>
            {children}
        </ServicesContext.Provider>
    )
}

export const useServices = () => {
    const context = useContext(ServicesContext)
    if (!context) {
        throw new Error('useServices must be used within ServicesProvider')
    }
    return context
}