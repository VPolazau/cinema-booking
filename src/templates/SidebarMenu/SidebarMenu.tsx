'use client';

import {Box, Button, Stack, Typography} from "@mui/material";
import {Separator} from "@ui";
import {FC, useMemo} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ISidebarMenu} from "./SidebarMenu.declaration";

const isActive = (pathname: string | null, href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
};

export const SidebarMenu: FC<ISidebarMenu> = ({ isAuthed, onAfterNavigate, title = 'Cinema booking' }) => {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = useMemo(() => {
        const items: Array<{ label: string; href: string; requiresAuth?: boolean }> = [
            { label: 'Фильмы', href: '/movies' },
            { label: 'Кинотеатры', href: '/cinemas' },
            { label: 'Мои билеты', href: '/my-tickets', requiresAuth: true },
        ];

        return items;
    }, []);

    const onNavigate = (href: string, requiresAuth?: boolean) => {
        if (requiresAuth && !isAuthed) {
            router.push(`/auth?next=${encodeURIComponent(href)}`);
        } else {
            router.push(href);
        }
        onAfterNavigate?.();
    };

    const onAuthClick = () => {
        if (isAuthed) {
            router.replace('/movies');
        } else {
            router.push('/auth?next=/my-tickets');
        }
        onAfterNavigate?.();
    };

    return (
        <Box sx={{ width: 280, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Cinema booking
            </Typography>

            <Separator type="dashed" />

            <Stack spacing={1} marginTop={3}>
                {navItems
                    .filter((x) => !x.requiresAuth || isAuthed) // "Мои билеты" скрываем пока не автhed
                    .map((x) => (
                        <Button
                            key={x.href}
                            variant={isActive(pathname, x.href) ? 'contained' : 'text'}
                            onClick={() => onNavigate(x.href, x.requiresAuth)}
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                width: '18vw',
                                minWidth: '260px'
                            }}
                        >
                            {x.label}
                        </Button>
                    ))}

                <Box sx={{ height: 8 }} />

                <Button
                    variant="outlined"
                    onClick={onAuthClick}
                    sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        width: '18vw',
                        minWidth: '260px'
                    }}
                >
                    {isAuthed ? 'Выход' : 'Вход'}
                </Button>
            </Stack>
        </Box>
    );
}