import { Box, Divider, useTheme } from "@mui/material";
import { lightGreen, orange } from "@mui/material/colors";
import JsonFormatter from "react-json-formatter";
import CopyToClipboardButton from "./copy-button";

export type JsonCardProps = {
  title: string;
  json: string;
};
export default function JsonCard({json, title}: JsonCardProps) {
  const theme = useTheme();
  const jsonStyle = {
    propertyStyle: { color: orange[900] },
    stringStyle: { color: theme.palette.primary.main },
    numberStyle: { color: lightGreen[900] },
  };
  return (
    <Box
      style={{
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2)
      }}
    >
      {title}
      <CopyToClipboardButton message={json} />
      <Divider/>
      <JsonFormatter json={json} tabWith={4} jsonStyle={jsonStyle} />
    </Box>
  );
}
