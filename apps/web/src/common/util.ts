// Update timestamps are saved at UTC in the database.
// Interpreting the dates in the client timezone may change the date, so parse date explicitly.
// See https://github.com/lindylearn/aboutideasnow/issues/8
export function getUTCDate(date: Date) {
    const utcDate = new Date(date.toISOString().slice(0, 10));

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
    }).format(utcDate);
}
