'use client';

import {FC, useMemo} from "react";
import {useDispatch} from "react-redux";
import {usePathname, useRouter} from "next/navigation";

import {Box, Button, Stack, Typography} from "@mui/material";
import {Separator} from "@ui";
import {authActions} from "@/store/slice/authSlice";

import { isActive } from './SidebarMenu.utils';
import {ISidebarMenu} from "./SidebarMenu.declaration";

import './SidebarMenu.styles.scss';

export const SidebarMenu: FC<ISidebarMenu> = ({ isAuthed, onAfterNavigate, title = 'Cinema booking' }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

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
            dispatch(authActions.logout());
            router.replace('/movies');
        } else {
            router.push('/auth?next=/my-tickets');
        }
        onAfterNavigate?.();
    };

    return (
        <Box className="sidebar-menu__wrapper">
            <Typography variant="h6" sx={{ mb: 2 }}>
                Cinema booking
            </Typography>

            <Separator type="dashed" />

            <Stack spacing={1} marginTop={3}>
                {navItems
                    .filter((x) => !x.requiresAuth || isAuthed)
                    .map((x) => (
                        <Button
                            key={x.href}
                            variant={isActive(pathname, x.href) ? 'contained' : 'text'}
                            onClick={() => onNavigate(x.href, x.requiresAuth)}
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                width: '100%',
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
                        width: '100%',
                    }}
                >
                    {isAuthed ? 'Выход' : 'Вход'}
                </Button>
            </Stack>
        </Box>
    );
}