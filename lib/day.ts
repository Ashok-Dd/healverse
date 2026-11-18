import { formatLocalDate } from "@/lib/today";

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

/**
 * Parses a timestamp from the server. It sends UTC wall-clock times without a zone suffix
 * (`2026-01-15T18:30:00`), which `new Date` would otherwise read as local time.
 */
export const parseServerTime = (timestamp: string): Date =>
  new Date(HAS_ZONE.test(timestamp) ? timestamp : `${timestamp}Z`);

/** The user's local day of a timestamp, the same day the server files the log under. */
export const dayOf = (timestamp: string): string => formatLocalDate(parseServerTime(timestamp));
