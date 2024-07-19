import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Print timestamp from Supabase string into user friendly readable format
 * @param {string} timestamp - timestamp from Supabase
 * @returns {string} - pretty print string for timestamp
 */

export default function printTimestamp(timestamp: string): string {
    return dayjs(timestamp).tz("Asia/Singapore").format("DD/MM/YYYY hh:mm A");
}
