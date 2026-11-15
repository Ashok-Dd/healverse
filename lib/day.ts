/** The UTC day of an ISO timestamp, the same day the server files the log under. */
export const dayOf = (isoTimestamp: string): string => isoTimestamp.split("T")[0];
