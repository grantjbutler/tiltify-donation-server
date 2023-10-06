import { Request, Response, NextFunction, RequestHandler } from 'express';
import { now } from '../../util/now';
const {
    createHmac,
} = require('node:crypto');

export function verifySignature(signingKey: string, signature: string, timestamp: string, body: string): boolean {
    const parsedTimestamp = new Date(timestamp);
    if (Math.abs(parsedTimestamp.getTime() - now()) > 2 * 60 * 1000) {
        return false;
    }

    const hmac = createHmac('sha256', signingKey);
    hmac.update(timestamp);
    hmac.update('.');
    hmac.update(body);

    const computedSignature = hmac.digest('base64');
    return signature === computedSignature;
}

export function makeVerifySignatureMiddleware(signingKey: string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const signature = req.get('X-Tiltify-Signature');
        const timestamp = req.get('X-Tiltify-Timestamp');
        const body = req.body as string;

        if (!signature || !timestamp || !body) {
            console.log('missing required data');
            res.status(422).end()
            return;
        }

        if (!verifySignature(signingKey, signature, timestamp, body)) {
            console.log('signature verification failed');
            res.status(403).send()
            return;
        }

        next();
    }
}