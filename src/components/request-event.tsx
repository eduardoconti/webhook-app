import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { RequestEvent } from "./home";

export type RequestEventProps = {
  requests: RequestEvent[];
  onClick: (id: string) => void;
  selectedRequestId?: string;
};
export default function RequestEventReceived({
  requests,
  onClick,
  selectedRequestId,
}: RequestEventProps) {
  const theme = useTheme();
  return (
    <Box sx={{ overflow: "auto" }} style={{ padding: theme.spacing(1) }}>
      {requests.length === 0 ? (
        <Typography align="center">
          {"Waiting for first event... "}
          <CircularProgress size={12} />
        </Typography>
      ) : null}

      {requests.map(({ time, id, method }, i) => {
        return (
          <Button
            key={i}
            variant="outlined"
            fullWidth
            style={{
              height: 25,
              alignItems: "center",
              margin: 2,
              boxShadow: theme.shadows[1],
            }}
            onClick={() => onClick(id)}
            color={
              selectedRequestId
                ? selectedRequestId === id
                  ? "success"
                  : "primary"
                : i === 0
                ? "success"
                : "primary"
            }
          >
            {`${new Date(time).toLocaleTimeString()} ${method}`}
          </Button>
        );
      })}
    </Box>
  );
}
