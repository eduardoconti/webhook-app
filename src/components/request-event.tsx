import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { RequestEvent } from "./drawer";

export type RequestEventProps = {
  requests: RequestEvent[];
  onClick: (id: string) => void
};
export default function RequestEventReceived({ requests, onClick }: RequestEventProps) {
  const theme = useTheme();
  return (
    <Box sx={{ overflow: "auto" }} style={{ padding: theme.spacing(1) }}>
      {requests.length === 0 ? (
        <Typography align="center">
          {"Waiting for first event... "}
          <CircularProgress size={12} />
        </Typography>
      ) : null}

      {requests.map(({ time, id }, i) => {
        return (
          <Button
            variant="outlined"
            fullWidth
            style={{ height: 25, alignItems: "center", margin: 2 }}
            onClick={ () => onClick(id)}
            color={i === 0 ? "success" : "primary"}
          >
            {new Date(time).toLocaleString()}
          </Button>
        );
      })}
    </Box>
  );
}
