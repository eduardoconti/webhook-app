import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Home from "./components/home";
const theme = createTheme({});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}

export default App;
