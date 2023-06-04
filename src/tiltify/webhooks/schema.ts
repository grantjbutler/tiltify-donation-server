import z from "zod";

export enum WebhookMessageType {
    DonationUpdated = "public:direct:donation_updated",
    CampaignUpdated = "public:direct:fact_updated"
}

export const WebhookMessageSchema = z.object({
    data: z.object({}).passthrough(), // keep this as empty for now, since we'll specialize this depending on the meta.event_type.
    meta: z.object({
        attempted_at: z.coerce.date(),
        event_type: z.nativeEnum(WebhookMessageType),
        generated_at: z.coerce.date(),
        id: z.string(),
        subscription_source_id: z.string(),
        subscription_source_type: z.string(),
    })
});