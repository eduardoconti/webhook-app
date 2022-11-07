import React from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export type CopyButtonProps = {
  message: string;
  disabled: boolean
};
export default function CopyToClipboardButton(props: CopyButtonProps) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(props.message);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="primary" disabled={props.disabled}>
        <ContentCopyIcon />
      </IconButton>
      <Snackbar
        autoHideDuration={1500}
        onClose={() => setOpen(false)}
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          sx={{ width: "100%" }}
          variant="filled"
          severity="info"
          color="success"
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
