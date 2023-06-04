import { z } from "zod";

export const ImageSchema = z.object({
    src: z.string().url(),
    width: z.number().int().nullable(),
    height: z.number().int().nullable(),
    alt: z.string().nullable()
});

export type Image = z.infer<typeof ImageSchema>