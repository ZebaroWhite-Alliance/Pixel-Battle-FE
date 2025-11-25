
import TemplateItem from "@/services/TemplateItem";
import Layer from "@/services/canvas/layers/Layer";
import TemplateManager from "@/services/TemplateManager";

type ResizeDirection = 'nw' | 'ne' | 'sw' | 'se' | null;

export default class TemplateLayer extends Layer {
    private manager: TemplateManager;
    private resizeDirection: ResizeDirection = null;
    private initialBounds: { x: number; y: number; width: number; height: number } | null = null;
    private isDragging = false;
    private dragOffset = { x: 0, y: 0 };

    private readonly CORNER_SIZE = 2;
    private readonly MIN_SIZE = 1;
    private readonly SELECTION_COLOR = '#00ff00';

    constructor(width: number, height: number, manager: TemplateManager) {
        super(width, height);
        this.manager = manager;
    }

    draw(): void {
        this.clear();
        this.manager.getTemplates().forEach(template => {
            if (template.enabled) {
                template.draw(this.context);
            }
        });
    }

    renderTo(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) return;

        ctx.drawImage(this.bufferCanvas, 0, 0);

        const active = this.manager.getActiveTemplate();
        if (active) {
            this.drawSelectionFrame(ctx, active);
        }
    }

    getCursor(mx: number, my: number): string {
        const active = this.manager.getActiveTemplate();
        if (!active) return 'default';

        const corner = this.getCornerAtPosition(mx, my, active);
        if (corner) return `${corner}-resize`;
        if (this.isPointInTemplate(mx, my, active)) return 'move';
        return 'default';
    }

    isInteracting(): boolean {
        return this.isDragging || this.resizeDirection !== null;
    }

    pointerDown(mx: number, my: number): boolean {
        const active = this.manager.getActiveTemplate();
        if (!active) return false;

        const corner = this.getCornerAtPosition(mx, my, active);
        if (corner) { this.startResize(corner, active); return true; }

        if (this.isPointInTemplate(mx, my, active)) { this.startDrag(mx, my); return true; }

        return false;
    }

    pointerMove(mx: number, my: number): void {
        const active = this.manager.getActiveTemplate();
        if (!active) return;

        if (this.resizeDirection && this.initialBounds) {
            this.handleResize(mx, my, active);
            this.draw();
        } else if (this.isDragging) {
            this.handleDrag(mx, my, active);
            this.draw();
        }
    }

    pointerUp(): void {
        this.isDragging = false;
        this.resizeDirection = null;
        this.initialBounds = null;
    }

    applyActiveTemplate() {
        this.manager.convertActiveToPixels();
        this.manager.setActiveTemplate(null);
        this.draw();
    }

    // === Приватные методы для Layer ===
    private drawSelectionFrame(ctx: CanvasRenderingContext2D, template: TemplateItem): void {
        const scale = ctx.getTransform().a;

        ctx.strokeStyle = this.SELECTION_COLOR;
        ctx.lineWidth = 2 / scale;
        ctx.setLineDash([5 / scale, 5 / scale]);
        ctx.strokeRect(template.x, template.y, template.width, template.height);

        const markerSize = 6 / scale;
        ctx.setLineDash([]);
        ctx.fillStyle = this.SELECTION_COLOR;

        this.drawCornerMarkers(ctx, template, markerSize);
    }

    private drawCornerMarkers(ctx: CanvasRenderingContext2D, template: TemplateItem, markerSize: number): void {
        const {x, y, width, height} = template;
        const corners = [
            {x: x - markerSize / 2, y: y - markerSize / 2},
            {x: x + width - markerSize / 2, y: y - markerSize / 2},
            {x: x - markerSize / 2, y: y + height - markerSize / 2},
            {x: x + width - markerSize / 2, y: y + height - markerSize / 2}
        ];
        corners.forEach(corner => ctx.fillRect(corner.x, corner.y, markerSize, markerSize));
    }

    private getCornerAtPosition(mx: number, my: number, template: TemplateItem): ResizeDirection {
        const corners = {
            nw: {x: template.x - this.CORNER_SIZE / 2, y: template.y - this.CORNER_SIZE / 2},
            ne: {x: template.x + template.width - this.CORNER_SIZE / 2, y: template.y - this.CORNER_SIZE / 2},
            sw: {x: template.x - this.CORNER_SIZE / 2, y: template.y + template.height - this.CORNER_SIZE / 2},
            se: {x: template.x + template.width - this.CORNER_SIZE / 2, y: template.y + template.height - this.CORNER_SIZE / 2},
        };
        for (const [dir, corner] of Object.entries(corners)) {
            if (this.isPointInRect(mx, my, corner.x, corner.y, this.CORNER_SIZE, this.CORNER_SIZE)) {
                return dir as ResizeDirection;
            }
        }
        return null;
    }

    private isPointInTemplate(mx: number, my: number, template: TemplateItem): boolean {
        return this.isPointInRect(mx, my, template.x, template.y, template.width, template.height);
    }

    private isPointInRect(mx: number, my: number, x: number, y: number, width: number, height: number): boolean {
        return mx >= x && mx <= x + width && my >= y && my <= y + height;
    }

    private startResize(direction: ResizeDirection, template: TemplateItem): void {
        this.resizeDirection = direction;
        this.initialBounds = { x: template.x, y: template.y, width: template.width, height: template.height };
        this.isDragging = false;
    }

    private startDrag(mx: number, my: number): void {
        this.isDragging = true;
        const active = this.manager.getActiveTemplate();
        if (!active) return;
        this.dragOffset = { x: mx - active.x, y: my - active.y };
    }

    private handleResize(mx: number, my: number, template: TemplateItem): void {
        if (!this.initialBounds) return;
        const {x, y, width, height} = this.initialBounds;
        let newX = x, newY = y, newWidth = width, newHeight = height;

        switch (this.resizeDirection) {
            case 'nw': newX = mx; newY = my; newWidth = width + (x - mx); newHeight = height + (y - my); break;
            case 'ne': newY = my; newWidth = mx - x; newHeight = height + (y - my); break;
            case 'sw': newX = mx; newWidth = width + (x - mx); newHeight = my - y; break;
            case 'se': newWidth = mx - x; newHeight = my - y; break;
        }

        newWidth = Math.max(newWidth, this.MIN_SIZE);
        newHeight = Math.max(newHeight, this.MIN_SIZE);

        template.setPosition(newX, newY);
        this.manager.resizeActiveTemplate(Math.round(newWidth), Math.round(newHeight));
    }

    private handleDrag(mx: number, my: number, template: TemplateItem): void {
        template.setPosition(mx - this.dragOffset.x, my - this.dragOffset.y);
    }
}
