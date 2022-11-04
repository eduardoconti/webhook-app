import React from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export type CopyButtonProps = {
  message: string
}
export default function CopyToClipboardButton(props: CopyButtonProps){
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(props.message);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="primary">
        <ContentCopyIcon />
      </IconButton>
      <Snackbar
        message="Copied to clipboard"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
};