'use client';

import { Alert, Snackbar } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { IErrorSnackbar } from './ErrorSnackbar.declarations';
import { useRouter } from 'next/navigation';
import { useDeviceMedia } from '@utils';

export const ErrorSnackbar: FC<IErrorSnackbar> = ({
    isError,
    message = 'Something went wrong',
    autoHideDuration = 2000,
}) => {
    const router = useRouter();
    const { isDesktop } = useDeviceMedia();

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        router.back();
    };

    useEffect(() => {
        if (isError) {
            setOpen(true);
        }
    }, [isError]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={
                isDesktop ? { vertical: 'bottom', horizontal: 'right' } : { vertical: 'top', horizontal: 'center' }
            }
        >
            <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};
