import styled from 'styled-components';
import { tabletScreen, mobileScreen } from '@utils';

export const StyledPageBody = styled('section')`
    padding: 40px 10px;
    width: 100%;
    height: calc(100vh - 96px);
    position: relative;
    overflow-y: scroll;
    margin-left: 20px;
    
    ${tabletScreen`
        padding: 30px 7px;
        height: calc(100vh - 76px);
    `}

    ${mobileScreen`
        padding: 20px 5px;
        height: calc(100vh - 56px);
    `}
`;