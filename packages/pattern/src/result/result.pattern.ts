export type Result<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

export function ok<T>(): Result<void, never>;
export function ok<T>(value: T): Result<T, never>;
export function ok<T>(value?: T): Result<T, never> {
  return { success: true, value: value as T };
}

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
