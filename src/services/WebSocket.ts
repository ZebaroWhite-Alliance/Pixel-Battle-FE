import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'https://pixel-battle.zebaro.dev/ws';

export class WebSocket {
    private client: Client;
    private connected = false;
    private url = WS_URL;
    private messageCallback?: (data: any) => void;

    constructor(private topic: string, callback?: (data: any) => void) {
        this.messageCallback = callback;

        this.client = new Client({
            webSocketFactory: () => new SockJS(this.url),
            reconnectDelay: 5000,
            debug: (str) => console.log('[STOMP DEBUG]', str),
        });

        this.client.onConnect = () => {
            this.connected = true;
            console.log('[WebSocket] ✅ Connected to', this.url);
            this.subscribe();
        };

        this.client.onDisconnect = () => {
            this.connected = false;
            console.log('[WebSocket] ❌ Disconnected');
        };

        this.client.onStompError = (frame) => {
            console.error('[WebSocket] STOMP error:', frame.headers['message']);
            console.error('Details:', frame.body);
        };
    }

    connect(callback?: (data: any) => void) {
        if (callback) {
            this.messageCallback = callback;
        }

        if (!this.connected) {
            console.log('[WebSocket] Connecting...');
            this.client.activate();
        }
    }

    disconnect() {
        if (this.connected) {
            console.log('[WebSocket] Disconnecting...');
            this.client.deactivate();
            this.connected = false;
        }
    }

    private subscribe() {
        if (!this.client.connected) return;

        console.log(`[WebSocket] Subscribing to topic: ${this.topic}`);
        this.client.subscribe(this.topic, (message: IMessage) => {
            let data;
            try {
                data = JSON.parse(message.body);
            } catch {
                data = message.body;
            }

            console.log('[WebSocket] Received:', data);

            if (this.messageCallback) {
                this.messageCallback(data);
            }
        });
    }
}
