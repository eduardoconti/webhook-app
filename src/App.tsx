import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import ClippedDrawer from "./components/drawer";
const theme = createTheme({});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClippedDrawer />
    </ThemeProvider>
  );
}

export default App;
