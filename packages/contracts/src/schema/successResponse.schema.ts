import zod from "zod";

export const SuccessResponseSchema = <T extends zod.ZodType>(dataSchema: T) =>
  zod.object({
    success: zod.literal(true),
    data: dataSchema,
    message: zod.string(),
    meta: zod.object({
      requestId: zod.string(),
      timestamp: zod.coerce.date(),
    }),
  });

export type SuccessResponse<T extends zod.ZodTypeAny> = zod.infer<
  typeof SuccessResponseSchema<T>
>;
