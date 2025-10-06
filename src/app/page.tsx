"use client"
import {useApi} from "@/context/ApiContext"
import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import {ColorPalette} from "@/services/ColorPalette"
import ColorPickerComponent from "@/components/ColorPickerComponent"
import PixelCanvasComponent from "@/components/PixelCanvasComponent"

const COLOR_PALETTE = [
    '#FFFFFF', '#000000', '#E53935', '#D81B60',
    '#8E24AA', '#5E35B1', '#3949AB', '#1E88E5',
    '#039BE5', '#00ACC1', '#00897B', '#43A047',
    '#FDD835', '#FB8C00', '#F4511E', '#6D4C41'
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