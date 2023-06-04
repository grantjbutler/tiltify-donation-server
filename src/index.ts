import { loadEnv } from "./util/env";
import isEqual from 'lodash.isequal';

import { createServer } from "http";
import { Server } from "socket.io";

import express from 'express';
import { makeWebhookRouter } from './tiltify/webhooks';
import { Money } from "./tiltify/models/money";

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { })

function reactive<T>(name: string): (value: T) => void {
    let storage: T | undefined;

    io.on('connection', (socket) => {
        if (storage) {
            socket.emit(name, storage)
        }
    });
    
    return (value: T) => {
        if (isEqual(value, storage)) {
            return;
        }
        
        storage = value
        
        io.emit(name, value);
    }
}

let setTotal = reactive<Money>('total');
let setTarget = reactive<Money>('target');

app.use(makeWebhookRouter({
    signingKey: loadEnv('TILTIFY_WEBHOOK_SIGNING_KEY'),
    onCampaignUpdated: (campaign) => {
        setTotal(campaign.amount_raised);
        setTarget(campaign.goal)
    },
    onDonationUpdated: (donation) => {
        io.emit('donation', donation);
    }
}))

httpServer.listen(loadEnv('PORT'), () => {

});