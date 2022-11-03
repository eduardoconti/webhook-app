import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import JsonFormatter from "react-json-formatter";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import ShareIcon from "@mui/icons-material/Share";

const drawerWidth = 240;

const jsonStyle = {
  propertyStyle: { color: "red" },
  stringStyle: { color: "green" },
  numberStyle: { color: "darkorange" },
};

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
  console.log('init')
  React.useEffect(() => {
    console.log('effect')
    const socket = io(apiHost);
    socket.on("disconnect", (reason) => {
      console.log(reason)
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to manually reconnect
        console.log(socket.active); // false
      }
      socket.off(webHookId)
    });
    socket.on("connect", () => {
      console.log("connected " + webHookId);
      socket.on(webHookId, (content: any) => {
        setRequests((req) => [content, ...req]);
      });
    });
  }, []);

  const link = apiHost + "/webhook/" + webHookId;
  const card = requests.find((e) => e.id === selectedRequestId) ?? requests[0];

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
        <Box sx={{ overflow: "auto" }}>
          <Typography align="center">
            {"Awaiting events... "}
            <CircularProgress size={12} />
          </Typography>
          {requests.map(({ time, id }, i) => {
            return (
     
                <Button variant="outlined" fullWidth
                  style={{ height: 25, alignItems: "center" }}
                  onClick={() => {
                    setSelectedRequestId(id);
                  }}
                >
                  {new Date(time).toLocaleString()}
                </Button>
  
            );
          })}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Typography paragraph align="center" boxShadow={2}>
          {link}
          <CopyToClipboardButton webHookId={link} />
        </Typography>
        <Grid container spacing={1}>
          {card ? (
            <>
              <Grid item xs={6}>
                Body
                <JsonFormatter
                  json={card.body}
                  tabWith={4}
                  jsonStyle={jsonStyle}
                />
              </Grid>
              <Grid item xs={6}>
                Headers
                <JsonFormatter
                  json={card.headers}
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

const CopyToClipboardButton = (props: { webHookId: string }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(props.webHookId);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="primary">
        <ShareIcon />
      </IconButton>
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
};
