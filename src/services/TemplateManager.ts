import TemplateItem from "@/services/TemplateItem"
import Pixel from "@/types/Pixel"
import EventEmitter from "@/utils/EventEmitter"

export default class TemplateManager {
    private templates: TemplateItem[] = []
    private activeTemplate: TemplateItem | null = null

    public events = new EventEmitter<{
        change: void,
        send: TemplateItem
    }>()

    addImage(name: string, img: HTMLImageElement, x = 0, y = 0): TemplateItem {
        const template = new TemplateItem(name, x, y)
        template.loadImage(img)
        this.setActiveTemplate(template)
        this.templates.push(template)
        this.events.emit("change", undefined)
        return template
    }

    addPixels(id: string, name: string, pixels: Pixel[]): TemplateItem {
        const template = TemplateItem.fromPixels(name, pixels, true, id)
        this.templates.push(template)
        this.events.emit("change", undefined)
        return template
    }

    setActiveTemplate(template: TemplateItem | null): void {
        this.activeTemplate = template
    }

    toggleTemplate(id: string, value?: boolean): void {
        const template = this.templates.find(t => t.id === id)
        if (!template) return

        template.enabled = value !== undefined ? value : !template.enabled

        this.events.emit("change", undefined)
    }

    getActiveTemplate(): TemplateItem | null {
        return this.activeTemplate
    }

    removeTemplate(template: TemplateItem): void {
        this.templates = this.templates.filter(t => t !== template)
        if (this.activeTemplate === template) this.activeTemplate = null
        this.events.emit("change", undefined)
    }

    clearAll(): void {
        this.templates = []
        this.activeTemplate = null
        this.events.emit("change", undefined)
    }

    convertActiveToPixels(): void {
        this.activeTemplate?.convertToPixels()
    }

    resizeActiveTemplate(width: number, height: number): void {
        if (this.activeTemplate?.hasImage() && !this.activeTemplate.isPixelBased) {
            this.activeTemplate.resize(width, height)
            this.events.emit("change", undefined)
        }
    }

    confirmActiveTemplate() {
        const template = this.getActiveTemplate()!
        this.convertActiveToPixels()
        this.setActiveTemplate(null)
        this.events.emit("send", template)
        this.events.emit("change", undefined)
    }

    getTemplates(): TemplateItem[] {
        return [...this.templates]
    }
}
