import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import shallow from "zustand/shallow";
import { useRequesEventStore } from "../hooks/useRequestEvent";


export default function RequestEventReceived() {
  const theme = useTheme();
  const { requests, setSelectedEventId, selectedEventId } = useRequesEventStore(
    (s) => ({
      requests: s.requests,
      setSelectedEventId: s.setSelectedEventId,
      selectedEventId: s.selectedEventId,
    }),
    shallow
  );
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
            onClick={() => setSelectedEventId(id)}
            color={
              selectedEventId
                ? selectedEventId === id
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
