export const callIfExist = <T extends unknown[]>(
    fn: ((...args: T) => void) | undefined,
    ...args: T
) => {
    fn?.(...args);
};