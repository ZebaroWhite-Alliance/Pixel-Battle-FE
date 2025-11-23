export default abstract class Layer {
    protected bufferCanvas: HTMLCanvasElement
    protected bufferCtx: CanvasRenderingContext2D
    visible = true

    constructor(width: number, height: number, willReadFrequently: boolean = false) {
        this.bufferCanvas = document.createElement('canvas')
        this.bufferCanvas.width = width
        this.bufferCanvas.height = height
        this.bufferCtx = this.bufferCanvas.getContext('2d', {willReadFrequently})!

        this.bufferCtx.imageSmoothingEnabled = false
        this.bufferCanvas.style.imageRendering = 'pixelated'
    }

    renderTo(ctx: CanvasRenderingContext2D) {
        if (!this.visible) return

        ctx.imageSmoothingEnabled = false
        ctx.drawImage(this.bufferCanvas, 0, 0)
    }

    clear() {
        this.bufferCtx.clearRect(0, 0, this.width, this.height)
    }

    get canvas() {
        return this.bufferCanvas
    }

    get context() {
        return this.bufferCtx
    }

    get width() {
        return this.bufferCanvas.width
    }

    get height() {
        return this.bufferCanvas.height
    }

    set width(width: number) {
        this.bufferCanvas.width = width
    }

    set height(height: number) {
        this.bufferCanvas.height = height
    }
}