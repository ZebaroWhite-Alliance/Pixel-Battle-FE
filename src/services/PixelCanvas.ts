export interface Pixel {
    x: number
    y: number
    color: string
}

interface ViewState {
    scale: number
    offsetX: number
    offsetY: number
}

interface PixelCanvasOptions {
    canvasSize?: number
    minZoom?: number
    maxZoom?: number
    showGrid?: boolean
}

export class PixelCanvas {
    private mainCanvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private bufferCanvas: HTMLCanvasElement
    private bufferCtx: CanvasRenderingContext2D
    private pixelsCache = new Set<string>()
    private viewState: ViewState = { scale: 8, offsetX: 0, offsetY: 0 }

    private readonly canvasSize: number
    private readonly minZoom: number
    private readonly maxZoom: number
    private showGrid: boolean

    private dragging = false
    private dragStart = { x: 0, y: 0 }
    private startOffset = { x: 0, y: 0 }

    constructor(options?: PixelCanvasOptions) {
        this.canvasSize = options?.canvasSize ?? 1000
        this.minZoom = options?.minZoom ?? 1
        this.maxZoom = options?.maxZoom ?? 32
        this.showGrid = options?.showGrid ?? true

        this.mainCanvas = document.createElement('canvas')
        this.mainCanvas.width = window.innerWidth
        this.mainCanvas.height = window.innerHeight
        this.ctx = this.mainCanvas.getContext('2d', { willReadFrequently: true })!
        this.ctx.imageSmoothingEnabled = false

        this.mainCanvas.style.imageRendering = 'pixelated';
        this.mainCanvas.addEventListener('contextmenu', e => e.preventDefault())

        this.bufferCanvas = document.createElement('canvas')
        this.bufferCanvas.width = this.canvasSize
        this.bufferCanvas.height = this.canvasSize
        this.bufferCtx = this.bufferCanvas.getContext('2d')!
        this.bufferCtx.fillStyle = '#FFFFFF'
        this.bufferCtx.fillRect(0, 0, this.canvasSize, this.canvasSize)

        this.drawToMainCanvas()
    }

    getCanvasElement() {
        return this.mainCanvas
    }

    getPixel(x: number, y: number): string {
        if (x < 0 || y < 0 || x >= this.canvasSize || y >= this.canvasSize) return "#FFFFFF"
        const key = `${x}-${y}`
        if (this.pixelsCache.has(key)) {
            return this.bufferCtx.getImageData(x, y, 1, 1).data.toString()
        }
        return "#FFFFFF"
    }

    drawPixel(x: number, y: number, color: string) {
        if (x < 0 || y < 0 || x >= this.canvasSize || y >= this.canvasSize) return
        const key = `${x}-${y}`
        console.log(color)
        this.bufferCtx.fillStyle = color
        this.bufferCtx.fillRect(x, y, 1, 1)
        this.pixelsCache.add(key)
        this.drawToMainCanvas()
    }

    drawPixels(pixels: Pixel[]) {
        for (const { x, y, color } of pixels) {
            if (x < 0 || y < 0 || x >= this.canvasSize || y >= this.canvasSize) continue
            const key = `${x}-${y}`
            if (!this.pixelsCache.has(key)) {
                this.bufferCtx.fillStyle = color
                this.bufferCtx.fillRect(x, y, 1, 1)
                this.pixelsCache.add(key)
            }
        }
        this.drawToMainCanvas()
    }

    clear() {
        this.bufferCtx.fillStyle = '#FFFFFF'
        this.bufferCtx.fillRect(0, 0, this.canvasSize, this.canvasSize)
        this.pixelsCache.clear()
        this.drawToMainCanvas()
    }

    drawToMainCanvas() {
        this.ctx.save()

        this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)

        const { scale, offsetX, offsetY } = this.viewState
        this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY)
        this.ctx.drawImage(this.bufferCanvas, 0, 0)

        if (this.showGrid && scale >= 8) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
            this.ctx.lineWidth = 1 / scale
            for (let i = 0; i <= this.canvasSize; i++) {
                this.ctx.beginPath()
                this.ctx.moveTo(i, 0)
                this.ctx.lineTo(i, this.canvasSize)
                this.ctx.stroke()

                this.ctx.beginPath()
                this.ctx.moveTo(0, i)
                this.ctx.lineTo(this.canvasSize, i)
                this.ctx.stroke()
            }
        }

        this.ctx.restore()
    }

    getCanvasCoordinates(clientX: number, clientY: number) {
        const rect = this.mainCanvas.getBoundingClientRect()
        return {
            x: Math.floor((clientX - rect.left - this.viewState.offsetX) / this.viewState.scale),
            y: Math.floor((clientY - rect.top - this.viewState.offsetY) / this.viewState.scale)
        }
    }

    handleZoom(e: WheelEvent) {
        e.preventDefault()
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
        const newScale = Math.min(Math.max(this.viewState.scale * zoomFactor, this.minZoom), this.maxZoom)

        const rect = this.mainCanvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        this.viewState = {
            scale: newScale,
            offsetX: mouseX - (mouseX - this.viewState.offsetX) * (newScale / this.viewState.scale),
            offsetY: mouseY - (mouseY - this.viewState.offsetY) * (newScale / this.viewState.scale)
        }

        this.drawToMainCanvas()
    }

    resize() {
        this.mainCanvas.width = window.innerWidth
        this.mainCanvas.height = window.innerHeight
        this.drawToMainCanvas()
    }

    toggleGrid() {
        this.showGrid = !this.showGrid
        this.drawToMainCanvas()
    }

    handleRightMouseDown(e: MouseEvent) {
        if (e.button !== 2) return // только правая кнопка
        this.dragging = true
        this.dragStart = { x: e.clientX, y: e.clientY }
        this.startOffset = { x: this.viewState.offsetX, y: this.viewState.offsetY }
    }

    handleRightMouseMove(e: MouseEvent) {
        if (!this.dragging) return
        const dx = e.clientX - this.dragStart.x
        const dy = e.clientY - this.dragStart.y
        this.viewState.offsetX = this.startOffset.x + dx
        this.viewState.offsetY = this.startOffset.y + dy
        this.drawToMainCanvas()
    }

    handleRightMouseUp(e: MouseEvent) {
        if (e.button !== 2) return
        this.dragging = false
    }
}
