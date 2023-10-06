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
        const body = JSON.parse(req.body);
        const message = WebhookMessageSchema.parse(body);

        switch (message.meta.event_type) {
            case WebhookMessageType.CampaignUpdated:
            case WebhookMessageType.PrivateCampaignUpdated:
                const campaign = CampaignSchema.parse(message.data);
                
                if (options.onCampaignUpdated) {
                    options.onCampaignUpdated(campaign);
                }

                break;

            case WebhookMessageType.DonationUpdated:
            case WebhookMessageType.PrivateDonationUpdated:
                const donation = DonationSchema.parse(message.data);

                if (options.onDonationUpdated) {
                    options.onDonationUpdated(donation);
                }

                break;
        }

        res.status(200).end();
    })

    return router;
}