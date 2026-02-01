import { Backdrop, Box, CircularProgress } from '@mui/material';
import { FC } from 'react';
import { IPageLoader } from './PageLoader.declarations';

export const PageLoader: FC<IPageLoader> = ({ isLoading }) => {
    return isLoading && (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open
            data-testid="loader"
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}
