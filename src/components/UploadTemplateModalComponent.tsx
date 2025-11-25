import React, { useState } from "react";
import FormContainer from "@/components/ui/FormContainer";
import Input from "@/components/ui/Input";
import ErrorField from "@/components/ui/ErrorField";
import Button from "@/components/ui/Button";

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd: (name: string, file: HTMLImageElement) => void;
}

export default function UploadTemplateModalComponent({ open, onClose, onAdd }: Props) {
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) return setError("Нужно указать название шаблона");
        if (!file) return setError("Нужно выбрать файл шаблона");
        if (!file.type.startsWith("image/")) return setError("Выбранный файл не является изображением");

        setLoading(true);

        try {
            const img = await fileToImage(file);
            onAdd(name.trim(), img); // теперь точно HTMLImageElement
            setName("");
            setFile(null);
            onClose();
        } catch {
            setError("Ошибка при загрузке изображения");
        } finally {
            setLoading(false);
        }
    };


    function fileToImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(img.src); // освобождаем память
                resolve(img);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <FormContainer title="Добавить шаблон" onSubmit={submit} className="z-10 max-w-md">
                <Input
                    label="Название шаблона"
                    placeholder="Например: Banner-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Файл шаблона"
                    type="file"
                    accept="image/*,application/json"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                {error && <ErrorField message={error} />}

                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" onClick={onClose}>Отмена</Button>
                    <Button type="submit" loading={loading}>Загрузить</Button>
                </div>
            </FormContainer>
        </div>
    );
}
