import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';

import { useLoginMutation, useRegisterMutation } from '@/store/api';
import { authActions } from '@/store/slice/authSlice';

import { ILoginForm, IRegisterForm } from './AuthForm.declarations';
import { loginSchema, registerSchema } from './AuthForm.utils';
import { loginFormDefault, registerFormDefault } from './AuthForm.constants';

export const AuthForm = () => {
    const router = useRouter();
    const search = useSearchParams();
    const dispatch = useDispatch();

    const [login, loginState] = useLoginMutation();
    const [register, registerState] = useRegisterMutation();

    const next = search.get('next') || '/my-tickets';

    const [tab, setTab] = useState<'login' | 'register'>('login');

    const isLoading = loginState.isLoading || registerState.isLoading;

    const [formError, setFormError] = useState<string | null>(null);

    const loginForm = useForm<ILoginForm>({
        resolver: yupResolver(loginSchema),
        defaultValues: loginFormDefault,
        mode: 'onChange',
    });

    const registerForm = useForm<IRegisterForm>({
        resolver: yupResolver(registerSchema),
        defaultValues: registerFormDefault,
        mode: 'onChange',
    });

    const title = useMemo(() => (tab === 'login' ? 'Вход' : 'Регистрация'), [tab]);

    const onSubmitLogin = async (values: ILoginForm) => {
        setFormError(null);
        try {
            const res = await login(values).unwrap();
            dispatch(authActions.setToken(res.token));
            router.replace(next);
        } catch {
            setFormError('Неверный логин или пароль. Проверьте введенные данные и попробуйте снова');
        }
    };

    const onSubmitRegister = async (values: IRegisterForm) => {
        setFormError(null);
        try {
            const res = await register({ username: values.username, password: values.password }).unwrap();
            dispatch(authActions.setToken(res.token));
            router.replace('/my-tickets');
        } catch (e: any) {
            setFormError('Не удалось зарегистрироваться. Попробуйте ещё раз');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', justifySelf: 'center', mt: 6, px: 2 }}>
            <Paper sx={{ width: '100%', maxWidth: 520, p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {title}
                </Typography>

                <Tabs
                    value={tab}
                    onChange={(_, value) => {
                        setFormError(null);
                        setTab(value);
                    }}
                    sx={{ mb: 2 }}
                >
                    <Tab value="login" label="Вход" />
                    <Tab value="register" label="Регистрация" />
                </Tabs>

                {formError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {formError}
                    </Alert>
                )}

                {tab === 'login' && (
                    <Box
                        component="form"
                        onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                        sx={{ display: 'grid', gap: 2 }}
                    >
                        <Controller
                            control={loginForm.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Username"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    autoComplete="username"
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            control={loginForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    type="password"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    autoComplete="current-password"
                                    fullWidth
                                />
                            )}
                        />

                        <Button type="submit" variant="contained" disabled={isLoading}>
                            Войти
                        </Button>
                    </Box>
                )}

                {tab === 'register' && (
                    <Box
                        component="form"
                        onSubmit={registerForm.handleSubmit(onSubmitRegister)}
                        sx={{ display: 'grid', gap: 2 }}
                    >
                        <Controller
                            control={registerForm.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Username"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    autoComplete="username"
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            control={registerForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    type="password"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    autoComplete="new-password"
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            control={registerForm.control}
                            name="passwordConfirmation"
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Password confirmation"
                                    type="password"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    autoComplete="new-password"
                                    fullWidth
                                />
                            )}
                        />

                        <Button type="submit" variant="contained" disabled={isLoading}>
                            Зарегистрироваться
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};
