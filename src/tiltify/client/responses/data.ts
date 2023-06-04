import { z } from "zod";

export function makeDataResponseSchema<Schema extends z.ZodTypeAny>(schema: Schema) {
    return z.object({
        data: schema
    });
}

export interface DataResponse<Value> {
    data: Value;
}