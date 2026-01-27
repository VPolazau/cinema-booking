import { FC } from 'react';

import { ISeparatorProps } from './Separator.declarations';
import { StyledSeparator } from './Separator.styles';

export const Separator: FC<ISeparatorProps> = ({
    type,
    className,
}) => <StyledSeparator className={className} type={type} />;