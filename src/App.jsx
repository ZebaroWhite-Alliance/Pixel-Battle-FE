import { useCallback, useEffect, useRef, useState } from 'react'

const API_URL = 'http://26.247.81.234:8080/pixel-battle/api/v1'
const CANVAS_SIZE = 1000
const MIN_ZOOM = 1
const MAX_ZOOM = 32
const COLOR_PALETTE = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'
]

const PixelBattle = () => {
    const mainCanvasRef = useRef(null)
    const bufferCanvas = useRef(document.createElement('canvas'))
    const ctxRef = useRef(null)
    const viewState = useRef({ scale: 8, offsetX: 0, offsetY: 0 })
    const interactionState = useRef({ drawing: false })
    const pixelsCache = useRef(new Set())

    const [username, setUsername] = useState('')
    const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0])
    const [brushSize, setBrushSize] = useState(1)
    const [showGrid, setShowGrid] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    const [authToken, setAuthToken] = useState(null)
    const [loginData, setLoginData] = useState({
        username: 'Denis',
        password: 'Denis123'
    })
    const [authError, setAuthError] = useState('')

    // Аутентификация пользователя
    const handleLogin = useCallback(async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            })

            if (!response.ok) {
                throw new Error('Ошибка аутентификации')
            }

            const { token } = await response.json()
            setAuthToken(token)
            localStorage.setItem('pixelToken', token)
            setAuthError('')
        } catch (err) {
            setAuthError('Неверные учетные данные')
            setAuthToken(null)
        }
    }, [loginData])

    // Инициализация холста
    useEffect(() => {
        const setupCanvases = async () => {
            const savedToken = localStorage.getItem('pixelToken')
            if (savedToken) {
                setAuthToken(savedToken)
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            const mainCanvas = mainCanvasRef.current
            mainCanvas.width = window.innerWidth
            mainCanvas.height = window.innerHeight
            ctxRef.current = mainCanvas.getContext('2d', { willReadFrequently: true })
            ctxRef.current.imageSmoothingEnabled = false

            // Инициализация буферного холста с белым фоном
            bufferCanvas.current.width = CANVAS_SIZE
            bufferCanvas.current.height = CANVAS_SIZE
            const bufferCtx = bufferCanvas.current.getContext('2d')
            bufferCtx.fillStyle = '#FFFFFF'
            bufferCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

            await fetchAndDrawPixels()
            setupEventListeners()
        }

        setupCanvases()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Загрузка пикселей с сервера
    const fetchAndDrawPixels = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/pixel`)
            if (!response.ok) throw new Error('Ошибка загрузки')
            const pixels = await response.json()

            const bufferCtx = bufferCanvas.current.getContext('2d')
            bufferCtx.imageSmoothingEnabled = false

            pixels.forEach(({ x, y, color }) => {
                const key = `${x}-${y}`
                if (!pixelsCache.current.has(key)) {
                    bufferCtx.fillStyle = color
                    bufferCtx.fillRect(x, y, 1, 1)
                    pixelsCache.current.add(key)
                }
            })

            drawToMainCanvas()
        } catch (err) {
            setErrorMessage('Ошибка загрузки пикселей')
        }
    }, [])

    // Отрисовка на основной канвас
    const drawToMainCanvas = useCallback(() => {
        const ctx = ctxRef.current
        ctx.save()

        // Очистка с белым фоном
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Применение трансформаций
        ctx.setTransform(
            Math.floor(viewState.current.scale),
            0,
            0,
            Math.floor(viewState.current.scale),
            Math.floor(viewState.current.offsetX),
            Math.floor(viewState.current.offsetY)
        )

        ctx.imageSmoothingEnabled = false
        ctx.drawImage(bufferCanvas.current, 0, 0)

        // Сетка
        if (showGrid && viewState.current.scale >= 8) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
            ctx.lineWidth = 1 / viewState.current.scale
            for (let i = 0; i <= CANVAS_SIZE; i++) {
                ctx.beginPath()
                ctx.moveTo(i, 0)
                ctx.lineTo(i, CANVAS_SIZE)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(0, i)
                ctx.lineTo(CANVAS_SIZE, i)
                ctx.stroke()
            }
        }

        ctx.restore()
    }, [showGrid])

    // Обновление пикселя
    const updatePixel = useCallback(async (x, y) => {
        if (!authToken) {
            setAuthError('Требуется авторизация')
            return
        }

        const bufferCtx = bufferCanvas.current.getContext('2d')
        const key = `${x}-${y}`

        // Сохраняем предыдущее состояние
        const prevColor = bufferCtx.getImageData(x, y, 1, 1).data

        // Оптимистичное обновление
        bufferCtx.fillStyle = selectedColor
        bufferCtx.fillRect(x, y, brushSize, brushSize)
        drawToMainCanvas()

        try {
            const response = await fetch(`${API_URL}/pixel/change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ x, y, color: selectedColor })
            })

            if (!response.ok) {
                // Откат при ошибке
                bufferCtx.fillStyle = `rgb(${prevColor[0]}, ${prevColor[1]}, ${prevColor[2]})`
                bufferCtx.fillRect(x, y, 1, 1)
                drawToMainCanvas()
                throw new Error('Ошибка сохранения')
            }

            pixelsCache.current.add(key)
        } catch (err) {
            setErrorMessage('Ошибка сохранения пикселя')
        }
    }, [selectedColor, brushSize, username, drawToMainCanvas])

    // Event handlers
    const getCanvasCoordinates = (clientX, clientY) => {
        const rect = mainCanvasRef.current.getBoundingClientRect()
        return {
            x: Math.floor((clientX - rect.left - viewState.current.offsetX) / viewState.current.scale),
            y: Math.floor((clientY - rect.top - viewState.current.offsetY) / viewState.current.scale)
        }
    }

    const handlePointerStart = (e) => {
        interactionState.current.drawing = true
        const { x, y } = getCanvasCoordinates(e.clientX, e.clientY)
        if (x >= 0 && y >= 0 && x < CANVAS_SIZE && y < CANVAS_SIZE) {
            updatePixel(x, y)
        }
    }

    const handlePointerMove = (e) => {
        if (!interactionState.current.drawing) return
        const { x, y } = getCanvasCoordinates(e.clientX, e.clientY)
        if (x >= 0 && y >= 0 && x < CANVAS_SIZE && y < CANVAS_SIZE) {
            updatePixel(x, y)
        }
    }

    const handlePointerEnd = () => {
        interactionState.current.drawing = false
    }

    const handleZoom = (e) => {
        e.preventDefault()
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
        const newScale = Math.min(Math.max(viewState.current.scale * zoomFactor, MIN_ZOOM), MAX_ZOOM)

        const { left, top } = mainCanvasRef.current.getBoundingClientRect()
        const mouseX = e.clientX - left
        const mouseY = e.clientY - top

        viewState.current = {
            scale: newScale,
            offsetX: mouseX - (mouseX - viewState.current.offsetX) * (newScale / viewState.current.scale),
            offsetY: mouseY - (mouseY - viewState.current.offsetY) * (newScale / viewState.current.scale)
        }

        drawToMainCanvas()
    }

    const handleResize = useCallback(() => {
        mainCanvasRef.current.width = window.innerWidth
        mainCanvasRef.current.height = window.innerHeight
        drawToMainCanvas()
    }, [drawToMainCanvas])

    const setupEventListeners = () => {
        window.addEventListener('resize', handleResize)
        mainCanvasRef.current.addEventListener('wheel', handleZoom, { passive: false })
    }

    if (!authToken) {
        return (
            <div className="auth-container">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>Авторизация</h2>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={loginData.username}
                        onChange={(e) => setLoginData(prev => ({
                            ...prev,
                            username: e.target.value
                        }))}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({
                            ...prev,
                            password: e.target.value
                        }))}
                    />
                    <button type="submit">Войти</button>
                    {authError && <div className="auth-error">{authError}</div>}
                </form>
            </div>
        )
    }

    return (
        <div className="app-container">
            <div className="user-panel">
                <span>Вы вошли как: {loginData.username}</span>
                <button onClick={() => {
                    setAuthToken(null)
                    localStorage.removeItem('pixelToken')
                }}>Выйти</button>
            </div>
            <canvas
                ref={mainCanvasRef}
                style={{
                    position: 'fixed',
                    cursor: 'crosshair',
                    imageRendering: 'crisp-edges'
                }}
                onMouseDown={handlePointerStart}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerEnd}
                onMouseLeave={handlePointerEnd}
            />

            <div className="control-panel">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                    className="username-input"
                />

                <div className="color-picker">
                    {COLOR_PALETTE.map(color => (
                        <button
                            key={color}
                            style={{ backgroundColor: color }}
                            className={`color-swatch ${color === selectedColor ? 'active' : ''}`}
                            onClick={() => setSelectedColor(color)}
                        />
                    ))}
                </div>

                <div className="toolbar">
                    <input
                        type="range"
                        min="1"
                        max="8"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Math.min(8, Math.max(1, +e.target.value)))}
                        className="brush-slider"
                    />

                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`grid-toggle ${showGrid ? 'active' : ''}`}
                    >
                        Grid {showGrid ? '▣' : '▢'}
                    </button>
                </div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        </div>
    )
}

const styles = `
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f0f0f0;
  }

  .login-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    width: 300px;
    
    input {
      width: 100%;
      padding: 8px;
      margin: 8px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      width: 100%;
      padding: 10px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
  }

  .auth-error {
    color: #ff4444;
    margin-top: 1rem;
    text-align: center;
  }

  .user-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255,255,255,0.9);
    padding: 10px;
    border-radius: 5px;
    display: flex;
    gap: 15px;
    align-items: center;
  }
  .app-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
    background: #f0f0f0;
  }

  .control-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    z-index: 1000;
  }

  .username-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .color-picker {
    display: grid;
    grid-template-columns: repeat(4, 36px);
    gap: 8px;
    margin-bottom: 12px;
  }

  .color-swatch {
    width: 36px;
    height: 36px;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .color-swatch.active {
    border-color: #000;
    transform: scale(1.1);
  }

  .toolbar {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .brush-slider {
    width: 120px;
    margin-right: 8px;
  }

  .grid-toggle {
    padding: 8px 16px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .grid-toggle.active {
    background: #2196f3;
    color: white;
    border-color: transparent;
  }

  .error-message {
    margin-top: 12px;
    color: #ff4444;
    font-size: 14px;
    max-width: 240px;
  }
`

export default function App() {
    return (
        <>
            <style>{styles}</style>
            <PixelBattle />
        </>
    )
}