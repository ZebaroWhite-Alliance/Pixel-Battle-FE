import Layer from "@/services/canvas/layers/Layer";
import Pixel from "@/types/Pixel";

export default class PixelLayer extends Layer {
    private pixelsCache = new Set<string>()

    constructor(width: number, height: number) {
        super(width, height, true)

        this.bufferCtx.fillStyle = '#FFFFFF'
        this.bufferCtx.fillRect(0, 0, width, height)
    }

    drawPixel(x: number, y: number, color: string) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return
        const key = `${x}-${y}`
        this.bufferCtx.fillStyle = color
        this.bufferCtx.fillRect(x, y, 1, 1)
        this.pixelsCache.add(key)
    }

    drawPixels(pixels: Pixel[]) {
        for (const {x, y, color} of pixels) {
            this.drawPixel(x, y, color)
        }
    }

    getPixel(x: number, y: number): string {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return "#FFFFFF"
        const key = `${x}-${y}`
        if (this.pixelsCache.has(key)) {
            const data = this.bufferCtx.getImageData(x, y, 1, 1).data
            return `#${data[0].toString(16).padStart(2, '0')}${data[1].toString(16).padStart(2, '0')}${data[2].toString(16).padStart(2, '0')}`
        }
        return "#FFFFFF"
    }

    clear() {
        this.bufferCtx.clearRect(0, 0, this.width, this.height)
        this.pixelsCache.clear()
    }
}
