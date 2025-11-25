type Listener<T = void> = (payload: T) => void;

export default class EventEmitter<Events extends Record<string, any>> {
    private listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

    on<K extends keyof Events>(event: K, fn: Listener<Events[K]>): () => void {
        if (!this.listeners[event]) this.listeners[event] = new Set();
        this.listeners[event]!.add(fn);
        return () => this.off(event, fn);
    }

    off<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
        this.listeners[event]?.delete(fn);
    }

    emit<K extends keyof Events>(event: K, payload: Events[K]) {
        this.listeners[event]?.forEach(fn => fn(payload));
    }
}
