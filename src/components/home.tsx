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
import {
  RequestEventProps,
  useRequesEventStore,
} from "../hooks/useRequestEvent";
import shallow from "zustand/shallow";
import { useWebhookIdStore } from "../hooks/useWebhookId";

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

  const setProps = useAlertStore((s) => s.setProps);

  const { webHookId, setWebHookId } = useWebhookIdStore(
    (s) => ({ webHookId: s.webhookId, setWebHookId: s.setWebhookId }),
    shallow
  );

  const socket = React.useMemo(
    () =>
      io(HOST, {
        reconnectionDelay: 5000,
      }),
    []
  );

  const uuid = React.useMemo(() => uuidv4(), []);

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
      setWebHookId()
    });

    socket.on("disconnect", (reason) => {
      setProps({
        message: `io server disconnect. Reason: ${reason}`,
        color: "error",
        severity: "error",
        isOpen: true,
      });
      socket.off("webhook");
      setWebHookId()
      clear();
    });
  }, [clear, setProps, setWebHookId, socket]);

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("connected " + socket.id);

      socket.emit("register", { socketId: socket.id, webHookId: uuid });
      socket.on("webhook", (content: RequestEventProps) => {
        addRequest(content);
        setSelectedEventId(content.id);
      });
      setWebHookId(uuid);
    });
  }, [addRequest, setSelectedEventId, setWebHookId, socket, uuid]);

  const link = `${HOST}/${webHookId}`;
  const requestEvent =
    requests.find((e) => e.id === selectedEventId) ?? requests[0];

  return (
    <Box sx={{ display: "flex" }}>
      <Layout />
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <Url url={link} disabled={webHookId ? false : true} />
        <Body requestEvent={requestEvent} />
      </Box>
      <AlertMessage />
    </Box>
  );

  function Layout() {
    const theme = useTheme();
    const drawerWidth =
      window.innerWidth > theme.breakpoints.values.sm ? 220 : 160;

    return React.useMemo(() => {
      return (
        <>
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
        </>
      );
    }, [drawerWidth]);
  }
}
