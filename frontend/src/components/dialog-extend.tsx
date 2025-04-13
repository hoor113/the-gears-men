import {
  FullscreenTwoTone as FullScreenIcon,
  FullscreenExitTwoTone as FullscreenExitIcon,
} from '@mui/icons-material';
import { Dialog, DialogProps, IconButton } from '@mui/material';
import { useState } from 'react';

import LocalizationProvider from './theme-registry/localization-provider';

type TDialogExtendProps = object & DialogProps;

const DialogExtend = (props: TDialogExtendProps) => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <Dialog fullWidth scroll="paper" fullScreen={fullScreen} {...props}>
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
        onClick={() => setFullScreen(!fullScreen)}
      >
        {fullScreen ? <FullscreenExitIcon /> : <FullScreenIcon />}
      </IconButton>
      <LocalizationProvider>{props.children}</LocalizationProvider>
    </Dialog>
  );
};

export default DialogExtend;
