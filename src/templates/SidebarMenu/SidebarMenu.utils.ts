export const isActive = (pathname: string | null, href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
};