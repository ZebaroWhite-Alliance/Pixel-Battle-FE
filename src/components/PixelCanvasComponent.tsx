"use client"
import {useEffect, useRef} from "react"
import {useServices} from "@/context/ServicesContext";

export default function PixelCanvasComponent() {
    const {pixelCanvas} = useServices()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        pixelCanvas.initEvents()
        containerRef.current?.appendChild(pixelCanvas.canvas)
        return () => {
            pixelCanvas.destroy()
        }
    }, [pixelCanvas])

    return <div ref={containerRef} style={{width: "100%", height: "100%"}}/>
}
