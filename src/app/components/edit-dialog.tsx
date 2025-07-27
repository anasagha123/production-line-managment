import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Input } from "@mui/joy";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function EditDialog({
  id,
  entered_id_initial,
  stage_initial,
  recieved,
  finished,
  quantity,
  refreshData,
}: {
  id: number;
  entered_id_initial: string;
  stage_initial: string;
  recieved: string;
  finished: string;
  quantity: number;

  refreshData: () => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [entered_id, setEntered_id] = React.useState(entered_id_initial);
  const [stage, setStage] = React.useState(stage_initial);

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Edit
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Edit task
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Input
            placeholder="task id"
            required
            value={entered_id}
            onChange={(e) => {
              setEntered_id(e.target.value);
            }}
          />
          <Input
            placeholder="stage"
            required
            value={stage}
            onChange={(e) => {
              setStage(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            cancel
          </Button>
          <Button
            autoFocus
            onClick={async () => {
              await fetch("/api/edit-task", {
                method: "PUT",
                body: JSON.stringify({
                  id: id,
                  entered_id: entered_id,
                  stage: stage,
                  recieved: recieved,
                  finished: finished,
                  quantity: quantity,
                }),
              });
              handleClose();
              await refreshData();
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
