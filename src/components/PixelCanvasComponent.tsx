"use client"
import {useEffect, useRef} from "react"
import {WebSocket} from "@/services/WebSocket";
import {useApi} from "@/context/ApiContext";
import PixelCanvas from "@/services/canvas/PixelCanvas";

interface PixelCanvasProps {
    selectedColor: string
}

export default function PixelCanvasComponent({selectedColor}: PixelCanvasProps) {
    const apiClient = useApi()
    const containerRef = useRef<HTMLDivElement>(null)
    const pixelCanvasRef = useRef<PixelCanvas | null>(null)

    useEffect(() => {
        const pixelCanvas = new PixelCanvas({width: 1000, height: 1000})
        pixelCanvasRef.current = pixelCanvas

        containerRef.current?.appendChild(pixelCanvas.canvas)

        apiClient.fetchPixels().then(pixels => pixelCanvas.drawPixels(pixels))
        const ws = new WebSocket('/topic/pixels')

        ws.connect((data) => {
            const {x, y, color} = data;
            pixelCanvas.drawPixel(x, y, color)
        })

        return () => {
            ws.disconnect()
            pixelCanvas.destroy()
        }
    }, [apiClient])

    useEffect(() => {
        const pixelCanvas = pixelCanvasRef.current
        if (!pixelCanvas) return

        return pixelCanvas.onClick(async (x, y, prevColor) => {
            pixelCanvas.drawPixel(x, y, selectedColor)
            try {
                await apiClient.setPixel(x, y, selectedColor)
            } catch {
                pixelCanvas.drawPixel(x, y, prevColor)
            }
        })
    }, [apiClient, selectedColor])

    return <div ref={containerRef} style={{width: "100%", height: "100%"}}/>
}
