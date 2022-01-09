interface INamedEvent<T> {
    on(name: string, handler: { (data?: T): void }) : void;
    off(name: string, handler: { (data?: T): void }) : void;
}

export default class NamedEvent<T> implements INamedEvent<T> {
    private handlers: Map<string, {(data?: T): void}[]> = new Map<string, {(data?: T): void}[]>();

    public on(name: string,handler: { (data?: T): void }) : void {
        if(!this.handlers.has(name)) {
            this.handlers.set(name, []);
        }
        this.handlers.get(name)?.push(handler);
    }

    public off(name: string,handler: { (data?: T): void }) : void {
        if(this.handlers.has(name)) {
            this.handlers.set(name, this.handlers.get(name)?.filter(h => h !== handler) ?? []);
        }
    }

    public trigger(name: string, data?: T) {
        this.handlers.get(name)?.slice(0).forEach(h => h(data));
    }

    public expose() : INamedEvent<T> {
        return this;
    }
}