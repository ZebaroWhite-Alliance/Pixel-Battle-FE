import ApiClient from "@/services/ApiClient";
import WebSocket from "@/services/WebSocket";
import ColorPalette from "@/services/ColorPalette";
import TemplateManager from "@/services/TemplateManager";
import PixelCanvas from "@/services/canvas/PixelCanvas";

export default class AppServices {
    apiClient: ApiClient;
    webSocketPixels: WebSocket;

    colorPalette: ColorPalette;
    templateManager: TemplateManager;

    pixelCanvas: PixelCanvas;

    constructor() {
        this.apiClient = new ApiClient();
        this.webSocketPixels = new WebSocket('/topic/pixels');

        this.colorPalette = new ColorPalette();
        this.templateManager = new TemplateManager();

        this.pixelCanvas = new PixelCanvas({
            width: 1000,
            height: 1000,
            templateManager: this.templateManager,
        });

        this.setupApiClient();
        this.setupWebSocket();

        this.setupPixelCanvas();
    }

    setupApiClient() {
        this.apiClient.fetchPixels().then(pixels => this.pixelCanvas.drawPixels(pixels))
        this.apiClient.fetchTemplates().then(templates => {
            templates.forEach(template => {
                const {id, name, pixels} = template
                this.templateManager.addPixels(id, name, pixels)
            })
        })

        this.pixelCanvas.onClick(async (x, y, prevColor) => {
            this.pixelCanvas.drawPixel(x, y, this.colorPalette.getSelectedColor())
            try {
                await this.apiClient.setPixel(x, y, this.colorPalette.getSelectedColor())
            } catch {
                this.pixelCanvas.drawPixel(x, y, prevColor)
            }
        })

        this.templateManager.events.on(
            "send",
            templateItem => this.apiClient.sendTemplate(templateItem)
        )
    }

    setupWebSocket() {
        this.webSocketPixels.connect((data) => {
            const {x, y, color} = data;
            this.pixelCanvas.drawPixel(x, y, color)
        })
    }

    setupPixelCanvas() {
    }
}
