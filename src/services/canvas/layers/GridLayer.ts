import Layer from "@/services/canvas/layers/Layer"

export default class GridLayer extends Layer {
    GRID_MIN_SCALE = 8

    renderTo(ctx: CanvasRenderingContext2D) {
        if (!this.visible) return

        const transform = ctx.getTransform()
        const scale = transform.a
        if (scale < this.GRID_MIN_SCALE) return

        const offset = 0.5 / scale

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.lineWidth = 1 / scale

        // vertical lines
        for (let i = 0; i <= this.width; i++) {
            ctx.beginPath()
            ctx.moveTo(i + offset, 0)
            ctx.lineTo(i + offset, this.height)
            ctx.stroke()
        }
        // horizontal lines
        for (let j = 0; j <= this.height; j++) {
            ctx.beginPath()
            ctx.moveTo(0, j + offset)
            ctx.lineTo(this.width, j + offset)
            ctx.stroke()
        }
    }
}
