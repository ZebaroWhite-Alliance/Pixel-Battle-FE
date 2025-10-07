"use client"
import ColorPalette from "@/services/ColorPalette"
import ColorPickerComponent from "@/components/ColorPickerComponent"
import PixelCanvasComponent from "@/components/PixelCanvasComponent"
import UserStatusComponent from "@/components/UserStatusComponent";
import {useState} from "react";

const COLOR_PALETTE = [
    "#FF0000", "#FFA500", "#FFFF00", "#00FF00",
    "#006400", "#00FFFF", "#00BFFF", "#0000FF",
    "#7B68EE", "#FF00FF", "#800080", "#FFFFFF",
    "#6A6A6A", "#3F3F3F", "#000000",
]

export default function Home() {
    const [palette] = useState(() => new ColorPalette(COLOR_PALETTE))
    const [selectedColor, setSelectedColor] = useState(palette.getSelectedColor())

    return (
        <div style={{width: "100vw", height: "100vh", position: "relative"}}>
            <ColorPickerComponent
                palette={palette}
                onChange={setSelectedColor}
            />
            <UserStatusComponent/>
            <PixelCanvasComponent selectedColor={selectedColor}/>
        </div>
    )
}