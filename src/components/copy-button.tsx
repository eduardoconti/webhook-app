import React from "react";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export type CopyButtonProps = {
  message: string
}
export default function CopyToClipboardButton(props: CopyButtonProps){

  const handleClick = () => {
    navigator.clipboard.writeText(props.message);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="primary">
        <ContentCopyIcon />
      </IconButton>
    </>
  );
};