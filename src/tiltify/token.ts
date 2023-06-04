import { z } from "zod";
import { now } from '../util/now';

export class Token {
    accessToken: string;
    refreshToken: string | null;
    expirationDate: Date;

    constructor(accessToken: string, refreshToken: string | null, expirationDate: Date) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expirationDate = expirationDate;
    }

    static fromResponse(response: TokenResponse): Token {
        return new Token(
            response.access_token,
            response.refresh_token,
            new Date(response.created_at.getTime() + (response.expires_in * 1000))
        )
    }

    get isExpired(): boolean {
        // Add a little bit of wiggle room to the expiration date so that we can refresh it before it expires, asn it's possible for that to be in the middle of a request.
        return this.expirationDate.getTime() - now() < 10;
    }
}

export const TokenResponseSchema = z.object({
    access_token: z.string(),
    created_at: z.coerce.date(),
    expires_in: z.number(),
    refresh_token: z.string().nullable(),
    scope: z.string(),
    token_type: z.string()
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;