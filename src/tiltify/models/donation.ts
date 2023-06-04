import z from "zod";
import { MoneySchema } from "./money";

export const DonationSchema = z.object({
    amount: MoneySchema,
    campaign_id: z.string(),
    completed_at: z.coerce.date().nullable(),
    donor_comment: z.string().nullable(),
    donor_name: z.string(),
    fundraising_event_id: z.string().nullable(),
    id: z.string(),
    poll_id: z.string().nullable(),
    poll_option_id: z.string().nullable(),
    reward_id: z.string().nullable(),
    sustained: z.boolean().nullable(),
    target_id: z.string().nullable(),
    team_event_id: z.string().nullable()
});

export type Donation = z.infer<typeof DonationSchema>;