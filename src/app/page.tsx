'use client'
import ColorPickerComponent from "@/components/ColorPickerComponent"
import PixelCanvasComponent from "@/components/PixelCanvasComponent"
import UserStatusComponent from "@/components/UserStatusComponent";
import TemplatePanelComponent from "@/components/TemplatePanelComponent";
import {useServices} from "@/context/ServicesContext";
import useEmitter from "@/hooks/useEmitter";


export default function Home() {
    const {session} = useServices()
    useEmitter(session.events, "authChange");

    return (
        <div style={{width: "100vw", height: "100vh", position: "relative"}}>
            <UserStatusComponent/>
            {session.isAuth && (
                <>
                    <ColorPickerComponent/>
                    <TemplatePanelComponent/>
                </>
            )}
            <PixelCanvasComponent/>
        </div>
    )
}