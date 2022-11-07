import { Snackbar, Alert } from "@mui/material";
import { useAlertStore } from "../hooks/useAlert";
import shallow from "zustand/shallow";

export default function AlertMessage() {
  const {  setClose, props } = useAlertStore(
    (s) => ({ setClose: s.setClose, props: s.props }),
    shallow
  );

  return (
    <Snackbar
      autoHideDuration={2000}
      onClose={() => setClose()}
      open={props.isOpen}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setClose()}
        sx={{ width: "100%" }}
        variant="filled"
        severity={props.severity ?? "info"}
        color={props.color ?? "success"}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
