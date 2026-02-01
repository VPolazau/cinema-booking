export const DATE_FORMAT = 'dd.MM.yyyy';

export const formatDateTime = (iso: string) => new Date(iso).toLocaleString();