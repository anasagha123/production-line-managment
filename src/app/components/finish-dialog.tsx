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

export default function FinishDialog({
  id,
  entered_id,
  stage,
  recieced,
  refreshData,
}: {
  id: number;
  entered_id: string;
  stage: string;
  recieced?: string;

  refreshData: () => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [valid, setValid] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const regex = new RegExp("[0-9]");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        disabled={recieced === null}
        onClick={handleClickOpen}
      >
        Finish
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Enter quantity
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
            placeholder="quantity"
            required={true}
            error={!valid}
            value={inputValue}
            onChange={(e) => {
              setValid(regex.test(e.target.value));
              setInputValue(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            cancel
          </Button>
          <Button
            autoFocus
            disabled={!valid}
            onClick={async () => {
              const current_time = new Date();
              const formatted_date = current_time.toISOString();
              await fetch("/api/edit-task", {
                method: "PUT",
                body: JSON.stringify({
                  id: id,
                  entered_id: entered_id,
                  stage: stage,
                  recieved: recieced,
                  finished: formatted_date,
                  quantity: Number.parseInt(inputValue),
                }),
              });
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
