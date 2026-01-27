'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export const usePageTransition = (delay = 300) => {
    const pathname = usePathname()
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        setIsTransitioning(true)

        const timeout = setTimeout(() => {
            setIsTransitioning(false)
        }, delay)

        return () => clearTimeout(timeout)
    }, [pathname])

    return { isTransitioning }
}
