import { FC } from 'react';
import { useLoadingTimeout, useMounted, useScrollToTopBtn } from '@utils';

import { ErrorSnackbar } from '../ErrorSnackbar';
import { PageLoader } from '../PageLoader';
import { LiquidGlassButton } from '../LiquidGlassButton';
import { Icon } from '../Icon';
import { IBasePage } from './BasePage.declrarations';
import { StyledPageBody } from './BasePage.styles';

export const BasePage: FC<IBasePage> = ({
    isError,
    errorMessage,
    isPending,
    children,
    isShowScrollBtn = true
}) => {
    const mounted = useMounted();
    const { containerRef, isVisible, handleScroll, scrollToTop } = useScrollToTopBtn();
    const { isTimeoutError } = useLoadingTimeout(isPending);

    const finalIsError = Boolean(isError) || isTimeoutError;
    if (!mounted) return null;

    return (
        <StyledPageBody
            ref={containerRef as any}
            onScroll={isShowScrollBtn ? handleScroll : undefined}
        >
            <PageLoader isLoading={isPending === true} />
            {finalIsError && (
                <ErrorSnackbar
                    isError={finalIsError}
                    message={isTimeoutError ? 'Загрузка заняла слишком много времени' : errorMessage}
                />
            )}
            {isPending !== true && !finalIsError && children}
            {isShowScrollBtn && isVisible && (
                <LiquidGlassButton
                    onClick={scrollToTop}
                    sx={{
                        position: "fixed",
                        bottom: 35,
                        right: 35,
                        zIndex: 2,
                        paddingTop: 0,
                    }}
                >
                    <Icon name="arrow-chevron-down" rotate={180} />
                </LiquidGlassButton>
            )}
        </StyledPageBody>
    );
};
