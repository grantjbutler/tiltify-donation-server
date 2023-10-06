import express, { Router } from "express";
import { WebhookMessageSchema, WebhookMessageType } from "./schema";
import { Campaign, CampaignSchema } from "./../models/campaign";
import { Donation, DonationSchema } from "./../models/donation";
import { makeVerifySignatureMiddleware } from "./verification";

export interface WebhookRouterOptions {
    signingKey: string;
    onCampaignUpdated?: (campaign: Campaign) => void;
    onDonationUpdated?: (donation: Donation) => void;
}

export function makeWebhookRouter(options: WebhookRouterOptions): Router {
    const router = Router();

    router.use(express.text({
        type: 'application/json'
    }));

    router.use(makeVerifySignatureMiddleware(options.signingKey));

    router.post('/', (req, res) => {
        try {
            const body = JSON.parse(req.body);
            const message = WebhookMessageSchema.parse(body);

            switch (message.meta.event_type) {
                case WebhookMessageType.CampaignUpdated:
                    const campaign = CampaignSchema.parse(message.data);
                    
                    if (options.onCampaignUpdated) {
                        options.onCampaignUpdated(campaign);
                    }

                    break;

                case WebhookMessageType.DonationUpdated:
                    const donation = DonationSchema.parse(message.data);

                    if (options.onDonationUpdated) {
                        options.onDonationUpdated(donation);
                    }

                    break;
            }

            res.status(200).end();
        } catch (error) {
            console.log(error);

            throw error;
        }
    })

    return router;
}