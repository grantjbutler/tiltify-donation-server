import { z } from "zod";
import { ImageSchema } from "./image";
import { MoneySchema } from "./money";
import { UserSchema } from "./user";

export const CampaignSchema = z.object({
    amount_raised: MoneySchema,
    avatar: ImageSchema.nullable(),
    cause_id: z.string(),
    description: z.string(),
    fundraising_event_id: z.string().nullable(),
    goal: MoneySchema,
    has_schedule: z.boolean(),
    id: z.string(),
    name: z.string(),
    original_goal: MoneySchema,
    published_at: z.coerce.date(),
    retired_at: z.coerce.date().nullable(),
    slug: z.string(),
    status: z.enum(['unpublished', 'published', 'retired']),
    supporting_type: z.enum(['none', 'public', 'private', 'invite_only']),
    total_amount_raised: MoneySchema,
    updated_at: z.coerce.date(),
    url: z.string(),
    user: UserSchema,
    user_id: z.string()
});

export type Campaign = z.infer<typeof CampaignSchema>;