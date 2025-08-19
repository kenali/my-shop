import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function DeleteModal({
  open,
  title = 'Confirm action',
  description = 'Are you sure?',
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: Props) {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">{cancelText}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}
