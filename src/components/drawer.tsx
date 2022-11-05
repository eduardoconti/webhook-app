import React from "react";
import { Typography, Box, Drawer, AppBar, Toolbar } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import Body from "./body";
import Url from "./url";
import RequestEventReceived from "./request-event";

const MAX_REQUESTS = 30;
const drawerWidth = 240;

export type RequestEvent = {
  body: string;
  headers: string;
  time: string;
  id: string;
  method: string;
};

const webHookId = uuidv4();
const apiHost = process.env.REACT_APP_API_HOST as string;

export default function ClippedDrawer() {
  const [requests, setRequests] = React.useState<RequestEvent[]>([]);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string>("");

  const socket = React.useMemo(() => io(apiHost), []);

  React.useEffect(() => {
    socket.on("disconnect", (reason) => {
      console.log("io server disconnect. Reason: " + reason);
      socket.off(webHookId);
    });

    socket.on("connect", () => {
      console.log("connected " + webHookId);
      socket.on(webHookId, (content: RequestEvent) => {
        setRequests((req) => {
          if (req.length >= MAX_REQUESTS) return [content];
          return [content, ...req];
        });
        setSelectedRequestId(content.id)
      });
    });
  }, [socket]);

  const link = `${apiHost}/${webHookId}`;
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
        <RequestEventReceived
          requests={requests}
          onClick={(id) => {
            setSelectedRequestId(id);
          }}
          selectedRequestId={selectedRequestId}
        />
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <Url url={link} />
        <Body requestEvent={requestEvent} />
      </Box>
    </Box>
  );
}
