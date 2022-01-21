interface INamedEvent<K, V> {
    on(name: K, handler: { (data?: V): void }) : void;
    off(name: K, handler: { (data?: V): void }) : void;
}

export default class NamedEvent<K, V> implements INamedEvent<K, V> {
    private handlers: Map<K, {(data?: V): void}[]> = new Map<K, {(data?: V): void}[]>();

    public on(name: K,handler: { (data?: V): void }) : void {
        if(!this.handlers.has(name)) {
            this.handlers.set(name, []);
        }
        this.handlers.get(name)?.push(handler);
    }

    public off(name: K,handler: { (data?: V): void }) : void {
        if(this.handlers.has(name)) {
            this.handlers.set(name, this.handlers.get(name)?.filter(h => h !== handler) ?? []);
        }
    }

    public trigger(name: K, data?: V) {
        this.handlers.get(name)?.slice(0).forEach(h => h(data));
    }

    public expose() : INamedEvent<K, V> {
        return this;
    }
}