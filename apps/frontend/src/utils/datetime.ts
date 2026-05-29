/**
 * Vietnam timezone utilities  (Asia/Ho_Chi_Minh, UTC+7)
 *
 * All DB timestamps are stored as UTC.  Calling `new Date(utcString)` in a
 * non-Vietnam browser would render the wrong local time.  Always pass the
 * `timeZone` option when formatting for Vietnamese users.
 */

export const VN_TZ = 'Asia/Ho_Chi_Minh';

/**
 * Format a UTC date/time string as a Vietnam local time string.
 * e.g. "2024-01-15T02:30:00.000Z" → "09:30" (UTC+7)
 */
export function formatVNTime(utcDate: string | Date): string {
    return new Date(utcDate).toLocaleTimeString('vi-VN', {
        timeZone: VN_TZ,
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format a UTC date/time string as a Vietnam local date string.
 * e.g. "2024-01-15T00:00:00.000Z" → "15/01/2024"
 */
export function formatVNDate(utcDate: string | Date): string {
    return new Date(utcDate).toLocaleDateString('vi-VN', {
        timeZone: VN_TZ,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Format a UTC date as a full Vietnam datetime string.
 * e.g. "Thứ Hai, 15/01/2024 – 09:30"
 */
export function formatVNDateTime(utcDate: string | Date): string {
    const d = new Date(utcDate);
    const datePart = d.toLocaleDateString('vi-VN', {
        timeZone: VN_TZ,
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const timePart = d.toLocaleTimeString('vi-VN', {
        timeZone: VN_TZ,
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${datePart} – ${timePart}`;
}

/**
 * Returns today's date in Vietnam timezone as a "YYYY-MM-DD" string.
 * Used as the default date for showtime filtering.
 */
export function todayVN(): string {
    return new Date()
        .toLocaleDateString('sv-SE', { timeZone: VN_TZ }); // sv-SE gives ISO format
}

/**
 * Builds a 7-day array starting from today (Vietnam local dates).
 * Returns objects with:
 *   - value: "YYYY-MM-DD" string (for query param)
 *   - label: "T2\n15/01" style label for the date-picker tab
 *   - isToday: boolean
 */
export function getNext7Days(): Array<{ value: string; dayName: string; dayNum: string; isToday: boolean }> {
    const today = todayVN();
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const value = d.toLocaleDateString('sv-SE', { timeZone: VN_TZ });
        const dayName = d.toLocaleDateString('vi-VN', { timeZone: VN_TZ, weekday: 'short' });
        const dayNum  = d.toLocaleDateString('vi-VN', { timeZone: VN_TZ, day: '2-digit', month: '2-digit' });
        return { value, dayName, dayNum, isToday: value === today };
    });
}
