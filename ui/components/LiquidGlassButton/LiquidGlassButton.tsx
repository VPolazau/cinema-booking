import { FC } from 'react';
import { IconButton } from '@mui/material';
import { ILiquidGlassButtonProps } from './LiquidGlassButton.declarations';

export const LiquidGlassButton: FC<ILiquidGlassButtonProps> = ({children, onClick, sx, ...props}) => (
   <IconButton
       onClick={onClick}
       sx={{
           width: 55,
           height: 55,
           borderRadius: "50%",
           background: "rgba(255, 255, 255, 0.35)",
           backdropFilter: "blur(12px)",
           WebkitBackdropFilter: "blur(12px)",
           boxShadow: `
                   0 8px 20px rgba(0, 0, 0, 0.12),
                   inset 0 0 0 1px rgba(255, 255, 255, 0.4)
               `,

           color: "rgba(0, 0, 0, 0.8)",
           transition: "all 0.2s ease",
           "&:hover": {
               background: "rgba(255, 255, 255, 0.55)",
               filter: "brightness(1.05)",
           },
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           ...sx,
       }}
       {...props}
   >
       {children}
   </IconButton>
);