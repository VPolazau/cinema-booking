import { FC, cloneElement } from 'react';

import { ICONS } from './constants';
import { IIconProps } from './Icon.declarations';

import { StyledIcon } from './Icon.styles';

export const Icon: FC<IIconProps> = ({ name, className, color, rotate, onClick, size }) => (
    <StyledIcon
        className={className}
        $color={color}
        $rotate={rotate}
        $size={size}
        onClick={onClick}
    >
        {ICONS[name] ? cloneElement(ICONS[name]) : null}
    </StyledIcon>
);
