import ColorPickerComponent from "@/components/ColorPickerComponent"
import PixelCanvasComponent from "@/components/PixelCanvasComponent"
import UserStatusComponent from "@/components/UserStatusComponent";
import TemplatePanelComponent from "@/components/TemplatePanelComponent";



export default function Home() {
    return (
        <div style={{width: "100vw", height: "100vh", position: "relative"}}>
            <ColorPickerComponent/>
            <UserStatusComponent/>
            <TemplatePanelComponent/>
            <PixelCanvasComponent/>
        </div>
    )
}