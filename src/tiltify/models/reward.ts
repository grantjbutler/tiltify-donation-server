import { z } from "zod";
import { ImageSchema } from "./image";
import { MoneySchema } from "./money";

export const RewardSchema = z.object({
    active: z.boolean(),
    amount: MoneySchema.nullable(),
    description: z.string().nullable(),
    ends_at: z.coerce.date().nullable(),
    fair_market_value: MoneySchema.nullable(),
    id: z.string(),
    image: ImageSchema.nullable(),
    inserted_at: z.coerce.date(),
    name: z.string(),
    quantity: z.number().int().nullable(),
    quantity_remaining: z.number().int().nullable(),
    starts_at: z.coerce.date().nullable(),
    updated_at: z.coerce.date()
});

export type Reward = z.infer<typeof RewardSchema>