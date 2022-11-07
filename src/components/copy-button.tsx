import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAlertStore } from "../hooks/useAlert";
import shallow from "zustand/shallow";

export type CopyButtonProps = {
  message: string;
  disabled: boolean;
};
export default function CopyToClipboardButton(props: CopyButtonProps) {
  const { setProps } = useAlertStore(
    (s) => ({ setProps: s.setProps }),
    shallow
  );

  const handleClick = () => {
    setProps({
      message: 'Copied to clipboard!',
      isOpen: true
    })
    navigator.clipboard.writeText(props.message);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="primary"
        disabled={props.disabled}
      >
        <ContentCopyIcon />
      </IconButton>
    </>
  );
}
