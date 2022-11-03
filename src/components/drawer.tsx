import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import JsonFormatter from "react-json-formatter";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import { lightGreen, orange } from "@mui/material/colors";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const MAX_REQUESTS = 30;
const drawerWidth = 240;

export type Requests = {
  body: string;
  headers: string;
  time: string;
  id: string;
};

const webHookId = uuidv4();
const apiHost = process.env.REACT_APP_API_HOST as string;

export default function ClippedDrawer() {
  const [requests, setRequests] = React.useState<Requests[]>([]);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string>("");
  const theme = useTheme();
  const jsonStyle = {
    propertyStyle: { color: orange[900] },
    stringStyle: { color: theme.palette.primary.main },
    numberStyle: { color: lightGreen[900] },
  };

  React.useEffect(() => {
    const socket = io(apiHost);
    socket.on("disconnect", (reason) => {
      console.log("io server disconnect. Reason: " + reason);
      socket.off(webHookId);
    });

    socket.on("connect", () => {
      console.log("connected " + webHookId);
      socket.on(webHookId, (content: any) => {
        setRequests((req) => {
          if (req.length >= MAX_REQUESTS) return [content];
          return [content, ...req];
        });
      });
    });
  }, []);

  const link = apiHost + "/webhook/" + webHookId;
  const requestEvent =
    requests.find((e) => e.id === selectedRequestId) ?? requests[0];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Webhook Simulator
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
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
                style={{ height: 25, alignItems: "center" }}
                onClick={() => {
                  setSelectedRequestId(id);
                }}
                color={i === 0 ? "success" : "primary"}
              >
                {new Date(time).toLocaleString()}
              </Button>
            );
          })}
        </Box>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography
          paragraph
          align="center"
          boxShadow={2}
          color={theme.palette.grey[700]}
        >
          <Typography component="span" color={theme.palette.text.primary} fontSize={12}>
            {"Use this URL > "}
          </Typography>
          {link}
          <CopyToClipboardButton message={link} />
        </Typography>

        <Grid container spacing={1}>
          {requestEvent ? (
            <>
              <Grid item xs={5}>
                Body
                <CopyToClipboardButton message={requestEvent.body} />
                <JsonFormatter
                  json={requestEvent.body}
                  tabWith={4}
                  jsonStyle={jsonStyle}
                />
              </Grid>
              <Grid item xs={1}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item xs={6}>
                Headers
                <CopyToClipboardButton message={requestEvent.headers} />
                <JsonFormatter
                  json={requestEvent.headers}
                  tabWith={4}
                  jsonStyle={jsonStyle}
                />
              </Grid>
            </>
          ) : null}
        </Grid>
      </Box>
    </Box>
  );
}

const CopyToClipboardButton = (props: { message: string }) => {
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
