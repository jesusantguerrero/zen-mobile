import { DateTime, Duration } from "luxon";

export function useDateTime() {
    const formatDate = (date: Date, format: string) => {
       return DateTime.fromJSDate(date || new Date()).toFormat(format || "yyyy-MM-dd");
    }

    const toISO = (date: Date) => {
       return date ? DateTime.fromJSDate(date).toISODate() :  ""
    }

    const formatDurationFromMs = (ms: number) => {
        return Duration.fromMillis(ms)
    }

    const getDateFromString = (dateValue: string) => {
        const date = dateValue ? dateValue.split("-") : null;
        return date  && typeof date == 'string' ? new Date(date[0], date[1] - 1, date[2]) : null;
    }

    return {
        toISO,
        formatDate,
        formatDurationFromMs,
        getDateFromString
    }
}
