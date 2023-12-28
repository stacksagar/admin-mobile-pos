import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ComponentTopLoader from '../../Loaders/ComponentTopLoader';
import { UseBoolean } from '../../../hooks/state/useBoolean';
import { Button } from '@mui/material';

interface Props {
  openModal: UseBoolean;
  title?: string;
  children?: React.ReactNode;
}

export default function MuiContentModal({ openModal, title, children }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    openModal.toggle();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openModal?.true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      {/* Top Loader */}
      <ComponentTopLoader loading={false} />

      {title ? <DialogTitle>{title}</DialogTitle> : null}

      <DialogContent>
        <div>{children}</div>
        <br />
        <Button
          variant="contained"
          color="warning"
          onClick={handleClose}
          type="button"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
