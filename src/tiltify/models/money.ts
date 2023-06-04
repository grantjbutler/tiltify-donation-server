import { z } from "zod";

export const MoneySchema = z.object({
    currency: z.string(),
    value: z.string()
});

export type Money = z.infer<typeof MoneySchema>;