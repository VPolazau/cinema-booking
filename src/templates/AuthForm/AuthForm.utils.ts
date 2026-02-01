import * as yup from 'yup';

import {ILoginForm, IRegisterForm} from "./AuthForm.declarations";

export const loginSchema: yup.ObjectSchema<ILoginForm> = yup.object({
    username: yup.string().required('Введите username').min(8, 'Минимум 8 символов'),
    password: yup.string()
        .required('Введите пароль')
        .min(8, 'Минимум 8 символов'),
        // не хочу подсказывать злоумышленникам, пожтому лучше оставлю так
});

export const registerSchema: yup.ObjectSchema<IRegisterForm> = yup.object({
    username: yup.string().required('Введите username').min(8, 'Минимум 8 символов'),
    password: yup
        .string()
        .required('Введите пароль')
        .min(8, 'Минимум 8 символов')
        .matches(/[A-Z]/, 'Минимум 1 заглавная буква')
        .matches(/\d/, 'Минимум 1 цифра'),
    passwordConfirmation: yup
        .string()
        .required('Повторите пароль')
        .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
});