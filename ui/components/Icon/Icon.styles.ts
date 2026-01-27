import styled from 'styled-components';

import { IStyledIconProps } from './Icon.declarations';
import { DEFAULT_COLOR, DEFAULT_SIZE } from './Icon.constants';
import { isNumber, toPixels, toDegrees } from '@utils';

const setSize = ({ $size }: IStyledIconProps) => {
    if ($size) {
        return isNumber($size) ? toPixels($size) : 'fit-content';
    }
    return toPixels(DEFAULT_SIZE);
};

export const StyledIcon = styled.span<IStyledIconProps>`
    display: inline-block;
    color: ${({ $color }) => $color || DEFAULT_COLOR};
    transform: rotate(${({ $rotate }) => toDegrees($rotate)});

    svg {
        width: ${setSize};
        height: ${setSize};
        overflow: visible;
    }
`;
