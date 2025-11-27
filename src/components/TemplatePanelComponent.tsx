"use client"
import React, { useState } from "react"

import BackgroundPanel from "@/components/ui/BackgroundPanel"
import Button from "@/components/ui/Button"
import Checkbox from "@/components/ui/Checkbox"
import Heading from "@/components/ui/Heading"
import Panel from "@/components/ui/Panel"
import Select from "@/components/ui/Select"
import Text from "@/components/ui/Text"
import UploadTemplateModalComponent from "@/components/UploadTemplateModalComponent"
import {useServices} from "@/context/ServicesContext"
import useEmitter from "@/hooks/useEmitter"
import TemplateItem from "@/services/TemplateItem"

export default function TemplatePanelComponent() {
    const {templateManager} = useServices()
    useEmitter(templateManager.events, "change")

    const [mode, setMode] = useState<"own" | "team">("own")
    const [modalOpen, setModalOpen] = useState(false)

    const handleToggle = (id: string, value: boolean) => {
        templateManager.toggleTemplate(id, value)
    }

    const handleConfirmPlacement = () => {
        templateManager.confirmActiveTemplate()
    }

    const handleAdd = (name: string, img: HTMLImageElement) => {
        templateManager.addImage(name, img)
    }

    const renderTemplate = (t: TemplateItem) => {
        const isAwaiting = t.hasImage()

        return (
            <Panel
                key={t.id}
                className="items-center justify-between mb-2 last:mb-0"
            >
                <div className="flex flex-col">
                    <Text>{t.name}</Text>
                    {isAwaiting && (
                        <Text className="!text-gray-500 italic text-xs">
                            (Awaiting placement)
                        </Text>
                    )}
                </div>

                {isAwaiting ? (
                    <Button onClick={() => handleConfirmPlacement()}>
                        Confirm
                    </Button>
                ) : (
                    <Checkbox
                        checked={t.enabled}
                        onChange={() => handleToggle(t.id, !t.enabled)}
                    />
                )}
            </Panel>
        )
    }

    return (
        <>
            <Panel className="fixed flex-col top-25 right-5 z-50">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <Heading>Templates</Heading>
                    <Button onClick={() => setModalOpen(true)}>Add</Button>
                </div>

                <Select<"own" | "team">
                    value={mode}
                    onChange={setMode}
                    options={[
                        { label: "Own", value: "own" },
                        // { label: "Team", value: "team" },
                    ]}
                />

                <BackgroundPanel>
                    {templateManager.getTemplates().length === 0 ? (
                        <Text>No templates</Text>
                    ) : (
                        templateManager.getTemplates().map(renderTemplate)
                    )}
                </BackgroundPanel>
            </Panel>

            <UploadTemplateModalComponent
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAdd}
            />
        </>
    )
}
