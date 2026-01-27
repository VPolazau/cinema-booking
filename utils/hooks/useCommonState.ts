import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useCommonState = () => {
    return useSelector((state: RootState) => state.common);
};
