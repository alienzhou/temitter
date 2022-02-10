type EventMap = Record<string, (...args: any[]) => void>;

type ListenerMap<T extends EventMap> = {
    [k in keyof T]: {
        listener: T[k];
        isOnce: boolean;
    }[];
};

export class EventEmitter<T extends EventMap> {
    private readonly listenerMap: ListenerMap<T> = Object.create(null);

    get eventNames() {
        return Object.keys(this.listenerMap).filter(e => this.listenerMap[e]?.length);
    }

    on = <K extends keyof T>(type: K, listener: T[K]): EventEmitter<T> => {
        if (!this.listenerMap[type]) {
            this.listenerMap[type] = [];
        }

        this.listenerMap[type].push({
            listener,
            isOnce: false,
        });

        return this;
    };

    // NOTE: maybe delete the key for the long life program
    off = <K extends keyof T>(type: K, listener?: T[K]): EventEmitter<T> => {
        if (!listener) {
            this.listenerMap[type] = [];

            return this;
        }

        const listeners = this.listenerMap[type];

        if (!listeners) {
            return this;
        }

        // remove the last listener
        for (let i = listeners.length - 1; i >= 0; i--) {
            const item = listeners[i];

            if (item.listener !== listener) {
                continue;
            }

            // only remove one
            listeners.splice(i, 1);
            break;
        }

        return this;
    };

    once = <K extends keyof T>(type: K, listener: T[K]): EventEmitter<T> => {
        if (!this.listenerMap[type]) {
            this.listenerMap[type] = [];
        }

        this.listenerMap[type].push({
            listener,
            isOnce: true,
        });

        return this;
    };

    offAll = (): EventEmitter<T> => {
        this.eventNames.forEach(event => this.off(event));

        return this;
    };

    emit = <K extends keyof T>(type: K, ...data: Parameters<T[K]>): EventEmitter<T> => {
        if (this.listenerMap[type]) {
            // trigger by sequence
            this.listenerMap[type].forEach(i => {
                // remove once listener first, the same as nodejs
                if (i.isOnce) {
                    this.off(type, i.listener);
                }

                i.listener(...data);
            });
        }

        return this;
    };
}
