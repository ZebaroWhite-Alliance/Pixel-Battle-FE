import React, { useState } from "react"

import Button from "@/components/ui/Button"
import ErrorField from "@/components/ui/ErrorField"
import FormContainer from "@/components/ui/FormContainer"
import Input from "@/components/ui/Input"

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd: (name: string, file: HTMLImageElement) => void;
}

export default function UploadTemplateModalComponent({ open, onClose, onAdd }: Props) {
    const [name, setName] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    if (!open) return null

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!name.trim()) return setError("You need to specify the name of the template")
        if (!file) return setError("You need to select a template file")
        if (!file.type.startsWith("image/")) return setError("The selected file is not an image")

        setLoading(true)

        try {
            const img = await fileToImage(file)
            onAdd(name.trim(), img)
            setName("")
            setFile(null)
            onClose()
        } catch {
            setError("Error loading image")
        } finally {
            setLoading(false)
        }
    }


    function fileToImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                URL.revokeObjectURL(img.src)
                resolve(img)
            }
            img.onerror = reject
            img.src = URL.createObjectURL(file)
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <FormContainer title="Add template" onSubmit={submit} className="z-10 max-w-md">
                <Input
                    label="Template name"
                    placeholder="For example: Banner-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Template file"
                    type="file"
                    accept="image/*,application/json"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                {error && <ErrorField message={error} />}

                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" onClick={onClose}>Cancellation</Button>
                    <Button type="submit" loading={loading}>Upload</Button>
                </div>
            </FormContainer>
        </div>
    )
}
