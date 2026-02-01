import { useCallback, useEffect, useRef, useState } from 'react';

export const useScrollToTopBtn = () => {
    const containerRef = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const rafIdRef = useRef<number | null>(null);

    const handleScroll = useCallback(() => {
        if (rafIdRef.current !== null) return;

        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;

            const el = containerRef.current;
            if (!el) return;

            const next = el.scrollTop > 0;
            setIsVisible((prev) => (prev === next ? prev : next));
        });
    }, []);

    const scrollToTop = useCallback(() => {
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

    return {
        containerRef,
        isVisible,
        handleScroll,
        scrollToTop,
    };
};
