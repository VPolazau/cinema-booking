export const getBookedAtMs = (bookedAt: string) => {
    const ms = Date.parse(bookedAt);
    return Number.isFinite(ms) ? ms : Date.now();
};