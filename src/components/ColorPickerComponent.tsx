"use client"
import Panel from "@/components/ui/Panel";
import BackgroundPanel from "@/components/ui/BackgroundPanel";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import {useServices} from "@/context/ServicesContext";
import useEmitter from "@/hooks/useEmitter";

export default function ColorPickerComponent() {
    const {colorPalette} = useServices()
    useEmitter(colorPalette.events, "change");

    const colors = colorPalette.getAllColors()
    const selectedIndex = colorPalette.getSelectedIndex()

    return (
        <Panel className="fixed flex-col top-5 left-5 z-50">
            <Heading>Select colour</Heading>
            <BackgroundPanel className="grid grid-cols-4 gap-2 p-2">
                {colors.map((color, index) => (
                    <Button
                        key={color}
                        onClick={() => colorPalette.selectColorByIndex(index)}
                        className={`
                            w-9 h-9 !rounded-sm
                            ${index === selectedIndex ? 'ring-2 ring-black scale-105' : ''}
                        `}
                        color={color}
                    />
                ))}
            </BackgroundPanel>
        </Panel>
    )
}
