import { z } from "zod";
import { Cursor, CursorSchema } from "../../models/cursor";

export function makePaginatedResponseSchema<Schema extends z.ZodTypeAny>(schema: Schema) {
    return z.object({
        data: z.array(schema),
        metadata: CursorSchema
    });
}

export interface PaginatedResponse<Value> {
    data: Value[];
    metadata: Cursor
}