import { z } from "zod";

export const CursorSchema = z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    limit: z.number().int()
});

export type Cursor = z.infer<typeof CursorSchema>