import Layer from "@/services/canvas/layers/Layer";

export default class LayerComposer extends Layer {
    private layers: Layer[] = []

    addLayer(layer: Layer) {
        this.layers.push(layer)
    }

    draw() {
        this.clear()
        for (const layer of this.layers) {
            layer.renderTo(this.bufferCtx)
        }
    }
}
