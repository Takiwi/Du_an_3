export type Result<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

export const ok = <T = void>(
  ...args: T extends void ? [] : [value: T]
): Result<T, never> => ({
  success: true,
  value: args[0] as T,
});

export const fail = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

// utils
export function unwrapResult<T, E extends Error>(result: Result<T, E>): T {
  if (!result.success) {
    throw result.error;
  }
  return result.value;
}
