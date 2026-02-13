import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import PrimaryButton from "./PrimaryButton";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onCancel}
      aria-describedby="confirm-dialog-description"
      slots={{
        transition: Transition,
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      {description && (
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        <PrimaryButton
            variant="outlined"
            label={cancelText}
            onClick={onCancel}
        />
        <PrimaryButton
            label={confirmText}
            onClick={onConfirm}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
