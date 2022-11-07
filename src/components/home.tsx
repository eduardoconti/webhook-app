import React from "react";
import {
  Typography,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import Body from "./body";
import Url from "./url";
import RequestEventReceived from "./request-event";
import AlertMessage from "./Alert";
import { useAlertStore } from "../hooks/useAlert";
import { RequestEventProps, useRequesEventStore } from "../hooks/useRequestEvent";
import shallow from "zustand/shallow";

const MAX_REQUESTS = 30;
const HOST = process.env.REACT_APP_API_HOST as string;

export default function Home() {
  const { requests, addRequest, clear, selectedEventId, setSelectedEventId } =
    useRequesEventStore(
      (s) => ({
        requests: s.requests,
        addRequest: s.addRequest,
        clear: s.clearRequests,
        selectedEventId: s.selectedEventId,
        setSelectedEventId: s.setSelectedEventId,
      }),
      shallow
    );
  const [webHookId, setWebHookId] = React.useState<string | undefined>(
    undefined
  );
  const setProps = useAlertStore((s) => s.setProps);
  const theme = useTheme();
  const drawerWidth =
    window.innerWidth > theme.breakpoints.values.sm ? 220 : 160;

  const socket = React.useMemo(
    () =>
      io(HOST, {
        reconnectionDelay: 5000,
      }),
    []
  );

  React.useEffect(() => {
    if (requests.length > MAX_REQUESTS) {
      return clear();
    }
  }, [clear, requests.length]);

  React.useEffect(() => {
    socket.on("connect_error", (e: any) => {
      setProps({
        message: `Failed to connect websocket! ${e.message}`,
        color: "error",
        severity: "error",
        isOpen: true,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("io server disconnect. Reason: " + reason);
      socket.off("webhook");
      clear();
    });
  }, [clear, setProps, socket]);

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("connected " + socket.id);
      const uuid = uuidv4();
      socket.emit("register", { socketId: socket.id, webHookId: uuid });
      socket.on("webhook", (content: RequestEventProps) => {
        addRequest(content);
        setSelectedEventId(content.id);
      });
      setWebHookId(uuid);
    });
  }, [addRequest, setSelectedEventId, socket]);

  const link = `${HOST}/${webHookId}`;
  const requestEvent =
    requests.find((e) => e.id === selectedEventId) ?? requests[0];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="span">
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
        <RequestEventReceived />
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <Url url={link} disabled={webHookId ? false : true} />
        <Body requestEvent={requestEvent} />
      </Box>
      <AlertMessage />
    </Box>
  );
}
