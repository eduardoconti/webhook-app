import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import CopyToClipboardButton from "./copy-button";
import Body from "./body";

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

  const link = `${apiHost}/webhook/${webHookId}`;
  const requestEvent =
    requests.find((e) => e.id === selectedRequestId) ?? requests[0];

  return (
    <Box sx={{ display: "flex" }}>
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
                style={{ height: 25, alignItems: "center", margin: 2 }}
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
          <Typography
            component="span"
            color={theme.palette.text.primary}
            fontSize={12}
          >
            {"Use this URL > "}
          </Typography>
          {link}
          <CopyToClipboardButton message={link} />
        </Typography>

       <Body requestEvent={requestEvent}/>
      </Box>
    </Box>
  );
}
