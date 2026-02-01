import { useEffect, useState } from 'react';

export const useLoadingTimeout = (isLoading?: boolean) => {
    const [isTimeoutError, setIsTimeoutError] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsTimeoutError(false);
            return;
        }

        const id = window.setTimeout(() => {
            setIsTimeoutError(true);
        }, 7000);

        return () => {
            window.clearTimeout(id);
        };
    }, [isLoading]);

    return { isTimeoutError };
};
