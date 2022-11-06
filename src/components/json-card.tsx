import { Box, Divider, useTheme } from "@mui/material";
import ReactJson from "react-json-view";

export type JsonCardProps = {
  title: string;
  json: string;
};
export default function JsonCard({ json, title }: JsonCardProps) {
  const theme = useTheme();
  return (
    <Box
      style={{
        boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        fontSize: window.innerWidth > theme.breakpoints.values.sm ? '1rem' : '0.75rem'
      }}
    >
      {title}
      <Divider style={{ marginBottom: theme.spacing(1) }} />
      <ReactJson
        src={JSON.parse(json)}
        name={false}
        displayObjectSize={false}
        displayDataTypes={false}
        onEdit={() => {}}
      />
    </Box>
  );
}
