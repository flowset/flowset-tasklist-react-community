export function filterNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}