import ApiClient from "@/services/ApiClient";
import WebSocket from "@/services/WebSocket";
import ColorPalette from "@/services/ColorPalette";
import TemplateManager from "@/services/TemplateManager";
import PixelCanvas from "@/services/canvas/PixelCanvas";
import Session from "@/services/Session";

export default class AppServices {
    apiClient: ApiClient;
    webSocketPixels: WebSocket;

    session: Session;

    colorPalette: ColorPalette;
    templateManager: TemplateManager;

    pixelCanvas: PixelCanvas;

    private unsubscribers: (() => void)[] = [];

    constructor() {
        this.apiClient = new ApiClient();
        this.webSocketPixels = new WebSocket('/topic/pixels');

        this.session = new Session(this.apiClient);

        this.colorPalette = new ColorPalette();
        this.templateManager = new TemplateManager();

        this.pixelCanvas = new PixelCanvas({
            width: 1000,
            height: 1000,
            templateManager: this.templateManager,
        });

        this.init()

        this.session.events.on("logout", () => this.unsubAll())
        this.session.events.on("login", () => this.initAfterAuth())

        this.session.checkAuth().then(() => this.initAfterAuth())
    }

    init() {
        this.apiClient.fetchPixels().then(pixels => this.pixelCanvas.drawPixels(pixels))

        this.webSocketPixels.connect((data) => {
            const {x, y, color} = data;
            this.pixelCanvas.drawPixel(x, y, color)
        })
    }

    initAfterAuth() {
        if (!this.session.isAuth) return
        this.apiClient.fetchTemplates().then(templates => {
            templates.forEach(template => {
                const {id, name, pixels} = template
                this.templateManager.addPixels(id, name, pixels)
            })
        })
        const unsubTemplates = () => this.templateManager.clearAll()


        const unsubOnClick = this.pixelCanvas.onClick(async (x, y, prevColor) => {
            this.pixelCanvas.drawPixel(x, y, this.colorPalette.getSelectedColor())
            try {
                await this.apiClient.setPixel(x, y, this.colorPalette.getSelectedColor())
            } catch {
                this.pixelCanvas.drawPixel(x, y, prevColor)
            }
        })

        const unsubSendTemplate = this.templateManager.events.on(
            "send",
            templateItem => this.apiClient.sendTemplate(templateItem)
        )

        this.unsubscribers.push(unsubTemplates, unsubOnClick, unsubSendTemplate)
    }

    unsubAll() {
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];
    }
}
