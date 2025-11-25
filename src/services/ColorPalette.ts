import EventEmitter from "@/utils/EventEmitter";

export default class ColorPalette {
    static COLOR_PALETTE = [
        "#FF0000", "#FFA500", "#FFFF00", "#00FF00",
        "#006400", "#00FFFF", "#00BFFF", "#0000FF",
        "#7B68EE", "#FF00FF", "#800080", "#FFFFFF",
        "#6A6A6A", "#3F3F3F", "#000000",
    ]

    private readonly colors: string[]
    private selectedIndex: number
    public events = new EventEmitter<{
        change: void
    }>();

    constructor(colors = ColorPalette.COLOR_PALETTE, defaultIndex = 0) {
        this.colors = colors
        this.selectedIndex = defaultIndex
    }

    getAllColors() {
        return this.colors
    }

    getSelectedColor() {
        return this.colors[this.selectedIndex]
    }

    selectColorByIndex(index: number) {
        if (index >= 0 && index < this.colors.length) {
            this.selectedIndex = index
            this.events.emit("change", undefined)
        }
    }

    selectColor(color: string) {
        const index = this.colors.indexOf(color)
        if (index !== -1) this.selectedIndex = index
    }

    getSelectedIndex() {
        return this.selectedIndex
    }
}
