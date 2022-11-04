import { Box, useTheme } from "@mui/material";
import { lightGreen, orange } from "@mui/material/colors";
import JsonFormatter from "react-json-formatter";
import CopyToClipboardButton from "./copy-button";

export type JsonCardProps = {
  title: string;
  json: string;
};
export default function JsonCard(props: JsonCardProps) {
  const theme = useTheme();
  const jsonStyle = {
    propertyStyle: { color: orange[900] },
    stringStyle: { color: theme.palette.primary.main },
    numberStyle: { color: lightGreen[900] },
  };
  return (
    <Box>
      {props.title}
      <CopyToClipboardButton message={props.json} />
      <JsonFormatter
        json={props.json}
        tabWith={4}
        jsonStyle={jsonStyle}
      />
    </Box>
  );
}
