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
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
      }}
    >
      {title}
      <Divider style={{marginBottom: theme.spacing(1)}}/>
      <ReactJson
        src={JSON.parse(json)}
        name={false}
        displayObjectSize={false}
        displayDataTypes={false}
        onEdit={()=>{}}
        
      />
    </Box>
  );
}
