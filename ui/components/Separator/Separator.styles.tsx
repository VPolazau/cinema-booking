import styled from 'styled-components';

import { SOLID_TYPE } from './Separator.contants';
import { ISeparatorProps } from './Separator.declarations';

export const StyledSeparator = styled.hr<ISeparatorProps>`
    border: 0;
    height: 0;
    border-top: 1px ${ (props: ISeparatorProps): string => props.type || SOLID_TYPE} #bfbfbf;
    margin: 8px 0;
`;