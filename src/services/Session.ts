import EventEmitter from "@/utils/EventEmitter";
import ApiClient from "@/services/ApiClient";

export type SessionEvents = {
    authChange: void;
    login: { username: string };
    logout: void;
};

export default class Session {
    apiClient: ApiClient;
    username: string | null = null;
    isAuth: boolean = false;

    events = new EventEmitter<SessionEvents>();

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async checkAuth() {
        try {
            const session = await this.apiClient.session();
            const wasAuth = this.isAuth;

            this.username = session?.username || null;
            this.isAuth = !!session?.username;

            if (this.isAuth !== wasAuth) {
                this.events.emit("authChange", undefined);
            }
        } catch {
            const wasAuth = this.isAuth;
            this.username = null;
            this.isAuth = false;
            if (wasAuth) this.events.emit("authChange", undefined);
        }
    }

    async login(username: string, password: string) {
        await this.apiClient.login(username, password);
        this.username = username;
        this.isAuth = true;

        this.events.emit("login", {username});
        this.events.emit("authChange", undefined);
    }

    async register(username: string, password: string) {
        await this.apiClient.register(username, password);
        this.username = username;
        this.isAuth = true;

        this.events.emit("login", {username});
        this.events.emit("authChange", undefined);
    }

    async logout() {
        await this.apiClient.logout();
        this.username = null;
        this.isAuth = false;

        this.events.emit("logout", undefined);
        this.events.emit("authChange", undefined);
    }
}
