import { TiltifyClient } from "./tiltify";
import { loadEnv } from "./util/env";

import express from 'express';
import { makeWebhookRouter } from './tiltify/webhooks';

// let client = new TiltifyClient({
//     clientId: loadEnv('TILTIFY_CLIENT_ID'),
//     clientSecret: loadEnv('TILTIFY_CLIENT_SECRET')
// });

// (async () => {
//     console.log(await client.campaigns.bySlug('unpreparedcasters', 'uc-tournament-of-champions'));
// })();

const app = express()

app.use(makeWebhookRouter({
    signingKey: loadEnv('TILTIFY_WEBHOOK_SIGNING_KEY'),
    onCampaignUpdated: (campaign) => {
        console.log(campaign)
    },
    onDonationUpdated: (donation) => {
        console.log(donation)
    }
}))

app.listen(loadEnv('PORT'), () => {

});