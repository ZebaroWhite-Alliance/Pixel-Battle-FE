import Pixel from "@/types/Pixel"

export default class TemplateItem {
    id: string
    name: string = ''
    x: number
    y: number
    width: number
    height: number
    pixels: Pixel[] = []
    enabled: boolean

    private originalImage?: HTMLImageElement
    private isConvertedToPixels: boolean = false

    constructor(
        name: string,
        x: number = 0,
        y: number = 0,
        width: number = 0,
        height: number = 0,
        enabled: boolean = true,
        id?: string
    ) {
        this.id = id || `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        this.name = name
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.enabled = enabled
    }

    static fromPixels(name: string, pixels: Pixel[], enabled: boolean = false, id?: string): TemplateItem {
        if (pixels.length === 0) {
            return new TemplateItem(name, 0, 0, 0, 0, enabled, id)
        }

        const xs = pixels.map(p => p.x)
        const ys = pixels.map(p => p.y)
        const minX = Math.min(...xs)
        const minY = Math.min(...ys)
        const maxX = Math.max(...xs)
        const maxY = Math.max(...ys)

        const item = new TemplateItem(name, minX, minY, maxX - minX + 1, maxY - minY + 1, enabled, id)
        item.pixels = pixels
        item.isConvertedToPixels = true

        return item
    }

    loadImage(img: HTMLImageElement) {
        this.originalImage = img
        this.width = img.naturalWidth || img.width
        this.height = img.naturalHeight || img.height
    }

    resize(newWidth: number, newHeight: number): void {
        if (!this.originalImage || this.isConvertedToPixels) return
        this.width = newWidth
        this.height = newHeight
    }

    convertToPixels(): void {
        if (!this.originalImage || this.isConvertedToPixels) return

        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(this.originalImage, 0, 0, this.width, this.height)

        const imageData = ctx.getImageData(0, 0, this.width, this.height)

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = (y * this.width + x) * 4
                const r = imageData.data[index]
                const g = imageData.data[index + 1]
                const b = imageData.data[index + 2]
                const a = imageData.data[index + 3]

                if (a > 25) {
                    this.pixels.push({
                        x: this.x + x,
                        y: this.y + y,
                        color: `rgb(${r}, ${g}, ${b})`
                    })
                }
            }
        }

        this.originalImage = undefined
        this.isConvertedToPixels = true
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.isConvertedToPixels || this.pixels.length > 0) {
            ctx.globalAlpha = 0.6
            for (const pixel of this.pixels) {
                ctx.fillStyle = pixel.color
                ctx.fillRect(pixel.x, pixel.y, 1, 1)
            }
            ctx.globalAlpha = 1
        } else if (this.originalImage) {
            ctx.globalAlpha = 0.6
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(this.originalImage, this.x, this.y, this.width, this.height)
            ctx.globalAlpha = 1
        }
    }

    setPosition(x: number, y: number): void {
        const deltaX = x - this.x
        const deltaY = y - this.y

        this.x = x
        this.y = y

        if (this.isConvertedToPixels || this.pixels.length > 0) {
            for (const pixel of this.pixels) {
                pixel.x += deltaX
                pixel.y += deltaY
            }
        }
    }

    get isPixelBased(): boolean {
        return this.isConvertedToPixels || this.pixels.length > 0
    }

    hasImage(): boolean {
        return !!this.originalImage
    }
}
