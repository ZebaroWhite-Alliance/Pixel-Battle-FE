export default class ColorPalette {
    private colors: string[]
    private selectedIndex: number

    constructor(colors: string[], defaultIndex = 0) {
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
