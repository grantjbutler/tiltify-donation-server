import { z } from "zod";

export const SocialsSchema = z.object({
    discord: z.string().nullable(),
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
    snapchat: z.string().nullable(),
    tiktok: z.string().nullable(),
    twitch: z.string().nullable(),
    twitter: z.string().nullable(),
    website: z.string().nullable(),
    youtube: z.string().nullable()
});

export type Socials = z.infer<typeof SocialsSchema>;