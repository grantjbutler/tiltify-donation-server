import { loadEnv } from "./util/env";
import isEqual from 'lodash.isequal';

import { createServer } from "http";
import { Server } from "socket.io";

import express from 'express';
import { makeWebhookRouter } from './tiltify/webhooks';

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { })

function reactive<T>(name: string): (value: T) => void {
    let storage: T | undefined;

    io.on('connection', (socket) => {
        if (storage) {
            socket.emit(name, storage)
        }

        socket.on('update', () => {
            socket.emit(name, storage);
        })
    });
    
    return (value: T) => {
        if (isEqual(value, storage)) {
            return;
        }
        
        storage = value
        
        io.emit(name, value);
    }
}

let setTotal = reactive<number>('total');
let setTarget = reactive<number>('target');

let campaignID = loadEnv('TILTIFY_CAMPAIGN_ID');

app.use(makeWebhookRouter({
    signingKey: loadEnv('TILTIFY_WEBHOOK_SIGNING_KEY'),
    onCampaignUpdated: (campaign) => {
        if (campaign.id != campaignID) {
            return;
        }

        console.log(`[${new Date()}] got campaign`, campaign);

        setTotal(parseFloat(campaign.amount_raised.value));
        setTarget(parseFloat(campaign.goal.value))
    },
    onDonationUpdated: (donation) => {
        if (donation.campaign_id != campaignID) {
            return;
        }

        console.log(`[${new Date()}] got donation`, donation);

        io.emit('donation', {
            id: donation.id,
            name: donation.donor_name,
            amount: {
                value: parseFloat(donation.amount.value),
                currency: donation.amount.currency
            },
            date_created: donation.completed_at,
            comment: donation.donor_comment
        });
    }
}))

httpServer.listen(loadEnv('PORT'), () => {

});