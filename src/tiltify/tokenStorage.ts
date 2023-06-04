import { Token } from './token';

export interface TokenStorage {
    get(): Token | undefined;
    store(token: Token): void;
}

export class InMemoryTokenStorage {
    private token?: Token

    constructor() {}

    get() {
        return this.token;
    }

    store(token: Token) {
        this.token = token;
    }
}