"use client"

import ViewState from "@/services/canvas/ViewState";

import LayerComposer from "@/services/canvas/layers/LayerComposer";
import PixelLayer from "@/services/canvas/layers/PixelLayer";
import GridLayer from "@/services/canvas/layers/GridLayer";
import TemplateLayer from "@/services/canvas/layers/TemplateLayer";
import TemplateManager from "@/services/TemplateManager";


export interface PixelCanvasOptions {
    width: number,
    height: number,
    templateManager: TemplateManager
}

export default class PixelCanvas {
    private readonly mainLayer: LayerComposer
    private readonly viewState: ViewState

    private readonly pixelLayer: PixelLayer
    private readonly gridLayer: GridLayer
    private readonly templateLayer: TemplateLayer


    constructor(options: PixelCanvasOptions) {
        this.mainLayer = new LayerComposer(window.innerWidth, window.innerHeight, true)
        this.mainLayer.canvas.addEventListener('contextmenu', e => e.preventDefault())

        this.viewState = new ViewState()


        this.pixelLayer = new PixelLayer(options.width, options.height)
        this.gridLayer = new GridLayer(options.width, options.height)
        this.templateLayer = new TemplateLayer(options.width, options.height, options.templateManager)

        this.mainLayer.addLayer(this.pixelLayer)
        this.mainLayer.addLayer(this.gridLayer)
        this.mainLayer.addLayer(this.templateLayer)

        // const img = new Image()
        // img.src = 'https://images.vexels.com/media/users/3/354131/isolated/preview/4fe7858f34cdd0cdba3ff384b80d246d-pixel-art-red-heart.png'
        // img.crossOrigin = "anonymous";
        // img.onload = () => {
        //     console.log('Картинка загружена')
        //     this.templateLayer.addImage(img)
        //     this.templateLayer.resizeActiveTemplate(16, 16)
        //     this.templateLayer.getActiveTemplate()!.x = 10
        //     this.templateLayer.getActiveTemplate()!.y = 10
        //     this.templateLayer.applyActiveTemplate()
        //     this.templateLayer.draw()
        //
        //     // console.log(this.templateLayer.getActiveTemplate()?.pixels)
        //     this.draw()
        // }

        options.templateManager.events.on('change', () => {
            this.templateLayer.draw()
            this.draw()
        });
    }

    get canvas() {
        return this.mainLayer.canvas
    }

    draw() {
        this.mainLayer.context.save()
        this.mainLayer.clear()
        const {scale, offsetX, offsetY} = this.viewState
        this.mainLayer.context.setTransform(scale, 0, 0, scale, offsetX, offsetY)
        this.mainLayer.draw()
        this.mainLayer.context.restore()
    }

    drawPixel(x: number, y: number, color: string) {
        this.pixelLayer.drawPixel(x, y, color)
        this.draw()
    }

    drawPixels(pixels: { x: number, y: number, color: string }[]) {
        this.pixelLayer.drawPixels(pixels)
        this.draw()
    }

    getCanvasCoordinates(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect()
        return {
            x: Math.floor((clientX - rect.left - this.viewState.offsetX) / this.viewState.scale),
            y: Math.floor((clientY - rect.top - this.viewState.offsetY) / this.viewState.scale)
        }
    }

    //region <--- Event Handlers --->
    initEvents() {
        window.addEventListener("resize", this.handleResize)
        this.mainLayer.canvas.addEventListener("wheel", this.handleWheel, {passive: false})
        this.mainLayer.canvas.addEventListener("mousedown", this.handleMouseDownBound)
        window.addEventListener("mousemove", this.handleMouseMoveBound)
        window.addEventListener("mouseup", this.handleMouseUpBound)
    }

    destroyEvents() {
        window.removeEventListener("resize", this.handleResize)
        this.mainLayer.canvas.removeEventListener("wheel", this.handleWheel)
        this.mainLayer.canvas.removeEventListener("mousedown", this.handleMouseDownBound)
        window.removeEventListener("mousemove", this.handleMouseMoveBound)
        window.removeEventListener("mouseup", this.handleMouseUpBound)
    }

    onClick(callback: (x: number, y: number, prevColor: string) => void) {
        const handler = (e: MouseEvent) => {
            const {x, y} = this.getCanvasCoordinates(e.clientX, e.clientY)
            const prevColor = this.pixelLayer.getPixel(x, y)
            callback(x, y, prevColor)
        }

        this.canvas.addEventListener("click", handler)
        return () => this.canvas.removeEventListener("click", handler)
    }

    handleWheel = (e: WheelEvent) => {
        e.preventDefault()

        const rect = this.mainLayer.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomDelta = e.deltaY > 0 ? -1 : 1;
        this.viewState.zoom(zoomDelta, mouseX, mouseY);

        this.draw()
    }

    handleResize = () => {
        this.mainLayer.width = window.innerWidth
        this.mainLayer.height = window.innerHeight
        this.draw()
    }

    handleMouseDownBound = (e: MouseEvent) => {
        const logicalPos = this.getCanvasCoordinates(e.clientX, e.clientY);

        if (e.button === 0) { // Левая кнопка - шаблоны
            if (this.templateLayer.pointerDown(logicalPos.x, logicalPos.y)) {
                e.preventDefault();
                return;
            }
            // Здесь можно добавить логику рисования пикселей
        } else if (e.button == 2)
            this.viewState.startDrag(e.clientX, e.clientY)
    }

    handleMouseMoveBound = (e: MouseEvent) => {
        const logicalPos = this.getCanvasCoordinates(e.clientX, e.clientY);

        this.canvas.style.cursor = this.templateLayer.getCursor(logicalPos.x, logicalPos.y);

        if (this.templateLayer.isInteracting()) {
            this.templateLayer.pointerMove(logicalPos.x, logicalPos.y);
            this.draw();
        } else if (this.viewState.dragging) {
            this.viewState.updateDrag(e.clientX, e.clientY)
            this.draw()
        }
    }

    handleMouseUpBound = (e: MouseEvent) => {
        if (e.button === 0) {
            this.templateLayer.pointerUp();
        } else if (e.button == 2)
            this.viewState.stopDrag()
    }

    //endregion

    destroy() {
        this.destroyEvents()
        this.canvas.remove()
    }
}