"use client"
import {useApi} from "@/context/ApiContext"
import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import {ColorPalette} from "@/services/ColorPalette"
import ColorPickerComponent from "@/components/ColorPickerComponent"
import PixelCanvasComponent from "@/components/PixelCanvasComponent"

const COLOR_PALETTE = [
    "#FF0000", "#FFA500", "#FFFF00", "#00FF00",
    "#006400", "#00FFFF", "#00BFFF", "#0000FF",
    "#7B68EE", "#FF00FF", "#800080", "#FFFFFF",
    "#6A6A6A", "#3F3F3F", "#000000",
]

export default function Home() {
    const router = useRouter()
    const apiClient = useApi()

    useEffect(() => {
        (async () => {
            if (!apiClient.getAccessToken()) return router.push("/login")

            const session = await apiClient.session()
            if (!session) router.push("/login")
        })()
    }, [apiClient, router])

    const [palette] = useState(() => new ColorPalette(COLOR_PALETTE))
    const [selectedColor, setSelectedColor] = useState(palette.getSelectedColor())

    return (
        <div style={{width: "100vw", height: "100vh", position: "relative"}}>
            <ColorPickerComponent
                palette={palette}
                onChange={setSelectedColor}
            />
            <PixelCanvasComponent
                apiClient={apiClient}
                selectedColor={selectedColor}
            />
        </div>
    )
}