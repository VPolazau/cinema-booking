export const getAssetUrl = (pathOrUrl: string) => {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;

    const base = process.env.NEXT_PUBLIC_API_URL ?? '';
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;

    return `${normalizedBase}${normalizedPath}`;
};