import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default class WebSocket {
    WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'https://pixel-battle.zebaro.dev/ws';

    private client: Client;
    private connected = false;
    private messageCallback?: (data: any) => void;
    private isDev = process.env.NODE_ENV === 'development';

    constructor(private topic: string, callback?: (data: any) => void) {
        this.messageCallback = callback;

        this.client = new Client({
            webSocketFactory: () => new SockJS(this.WS_URL),
            reconnectDelay: 5000,
            debug: (str: string) => {
                if (this.isDev) console.log('[STOMP DEBUG]', str);
            },
        });

        this.client.onConnect = () => {
            this.connected = true;
            if (this.isDev) console.log('[WebSocket] Connected to', this.WS_URL);
            this.subscribe();
        };

        this.client.onDisconnect = () => {
            this.connected = false;
            if (this.isDev) console.log('[WebSocket] Disconnected');
        };

        this.client.onStompError = (frame) => {
            console.error('[WebSocket] STOMP error:', frame.headers['message']);
            console.error('Details:', frame.body);
        };
    }

    connect(callback?: (data: any) => void) {
        if (callback) this.messageCallback = callback;
        if (!this.connected) this.client.activate();
    }

    disconnect() {
        if (this.connected) {
            this.client.deactivate();
            this.connected = false;
        }
    }

    private subscribe() {
        if (!this.client.connected) return;

        this.client.subscribe(this.topic, (message: IMessage) => {
            let data;
            try {
                data = JSON.parse(message.body);
            } catch {
                data = message.body;
            }

            if (this.isDev) console.log('[WebSocket] Received:', data);

            this.messageCallback?.(data);
        });
    }
}
