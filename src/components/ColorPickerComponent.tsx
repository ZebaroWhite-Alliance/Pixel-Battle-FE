import ColorPalette from '@/services/ColorPalette'

interface ColorPickerProps {
    palette: ColorPalette
    onChange: (color: string) => void
}

export default function ColorPickerComponent({palette, onChange}: ColorPickerProps) {
    const colors = palette.getAllColors()
    const selectedIndex = palette.getSelectedIndex()

    return (
        <div
            style={{
                position: 'fixed',
                top: 20,
                left: 20,
                backgroundColor: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                padding: 16,
                zIndex: 1000,
                userSelect: 'none',
                border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
        >
            <h2 style={{margin: '0 0 12px', fontSize: 16}}>Выберите цвет</h2>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(4, 36px)`,
                    gap: 8,
                    padding: 8,
                    borderRadius: 10,
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fafafa',
                }}
            >
                {colors.map((color, index) => (
                    <button
                        key={color}
                        onClick={() => {
                            palette.selectColorByIndex(index)
                            onChange(color)
                        }}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 6,
                            border: index === selectedIndex
                                ? '2px solid #000'
                                : '2px solid transparent',
                            backgroundColor: color,
                            cursor: 'pointer',
                            transform: index === selectedIndex ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.1s',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
