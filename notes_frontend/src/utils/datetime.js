// PUBLIC_INTERFACE
export function formatDateTime(epochMs) {
  /** Format epoch milliseconds into a compact local date+time string. */
  if (typeof epochMs !== "number") return "";
  try {
    return new Date(epochMs).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
