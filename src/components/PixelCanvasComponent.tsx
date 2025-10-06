"use client"
import { useEffect, useRef } from "react"
import { PixelCanvas } from "@/services/PixelCanvas"
import {ApiClient} from "@/services/ApiClient";

interface PixelCanvasProps {
    apiClient: ApiClient
    selectedColor: string
}

export default function PixelCanvasComponent({ apiClient, selectedColor }: PixelCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const pixelCanvasRef = useRef<PixelCanvas | null>(null)

    useEffect(() => {
        const canvas = new PixelCanvas()
        apiClient.fetchPixels().then(pixels => canvas.drawPixels(pixels))
        pixelCanvasRef.current = canvas

        const el = canvas.getCanvasElement()
        containerRef.current?.appendChild(el)

        const handleResize = () => canvas.resize()
        const handleWheel = (e: WheelEvent) => canvas.handleZoom(e)
        const handleMouseDown = (e: MouseEvent) => canvas.handleRightMouseDown(e)
        const handleMouseMove = (e: MouseEvent) => canvas.handleRightMouseMove(e)
        const handleMouseUp = (e: MouseEvent) => canvas.handleRightMouseUp(e)

        window.addEventListener("resize", handleResize)
        el.addEventListener("wheel", handleWheel, { passive: false })
        el.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("resize", handleResize)
            el.removeEventListener("wheel", handleWheel)
            el.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [apiClient])

    useEffect(() => {
        const canvas = pixelCanvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const handleClick = async (e: MouseEvent) => {
            const { x, y } = canvas.getCanvasCoordinates(e.clientX, e.clientY)
            await apiClient.setPixel(x, y, selectedColor)
            canvas.drawPixel(x, y, selectedColor)
        }

        container.addEventListener("click", handleClick)
        return () => container.removeEventListener("click", handleClick)
    }, [apiClient, selectedColor])

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}
