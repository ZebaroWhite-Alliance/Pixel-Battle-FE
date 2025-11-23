export default class ViewState {
    readonly MIN_ZOOM = 1
    readonly MAX_ZOOM = 32

    scale = 8
    offsetX = 0
    offsetY = 0

    dragging = false
    private dragStart = { x: 0, y: 0 }
    private startOffset = { x: 0, y: 0 }

    // ===== Scale =====
    zoom(delta: number, centerX: number, centerY: number) {
        const oldScale = this.scale
        let newScale = oldScale + delta
        newScale = Math.min(Math.max(newScale, this.MIN_ZOOM), this.MAX_ZOOM)

        const ratio = newScale / oldScale
        this.setOffset(
            centerX - (centerX - this.offsetX) * ratio,
            centerY - (centerY - this.offsetY) * ratio
        )

        this.scale = newScale
    }

    setOffset(x: number, y: number) {
        this.offsetX = x
        this.offsetY = y
    }

    // ===== Dragging =====
    startDrag(x: number, y: number) {
        this.dragging = true
        this.dragStart = { x, y }
        this.startOffset = { x: this.offsetX, y: this.offsetY }
    }

    updateDrag(x: number, y: number) {
        if (!this.dragging) return
        this.offsetX = this.startOffset.x + (x - this.dragStart.x)
        this.offsetY = this.startOffset.y + (y - this.dragStart.y)
    }

    stopDrag() {
        this.dragging = false
    }
}
