import zod, { ZodType } from "zod";

export function convertDataToDto<T, F extends ZodType>(to: T, from: F) {
  const result = from.safeParse(to);

  if (!result.success) {
    return result.error.issues.map((issues) => ({
      field: issues.path.join(","),
      message: issues.message,
    }));
  }

  return result.data as zod.infer<F>;
}
