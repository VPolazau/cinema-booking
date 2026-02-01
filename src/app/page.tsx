'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {useDispatch} from "react-redux";
import {authActions} from "@/store/slice/authSlice";

export default function Page() {
    const router = useRouter();

    useEffect(() => router.replace('/movies'), []);
    return null;
}