import { SEPARATOR_TYPES } from './Separator.contants';

type TSeparatorType = typeof SEPARATOR_TYPES[number];

export interface ISeparatorProps {
    type?: TSeparatorType;
    className?: string;
}