import { z } from "zod";
import { ImageSchema } from "./image";
import { MoneySchema } from "./money";
import { SocialsSchema } from "./socials";

export const UserSchema = z.object({
    avatar: ImageSchema.nullable(),
    description: z.string().nullable(),
    id: z.string(),
    slug: z.string(),
    social: SocialsSchema,
    total_amount_raised: MoneySchema,
    url: z.string(),
    username: z.string()
})

export type User = z.infer<typeof UserSchema>