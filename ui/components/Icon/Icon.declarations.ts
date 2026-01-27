import { SyntheticEvent } from 'react';

import { ICONS } from './constants';
import { ICON_SIZES } from './Icon.constants';

export type TIconName = keyof typeof ICONS;
export type TIconSize = typeof ICON_SIZES[number];

export interface IIconProps {
    name: TIconName;
    className?: string;
    color?: string;
    rotate?: number;
    size?: TIconSize;

    onClick?(event: SyntheticEvent): void;
}

export interface IStyledIconProps {
    $color?: string;
    $rotate?: number;
    $size?: TIconSize;
}
