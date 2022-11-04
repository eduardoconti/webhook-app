import { Typography, useTheme } from "@mui/material";
import CopyToClipboardButton from "./copy-button";

export type UrlProps = {
  url: string;
};

export default function Url({ url }: UrlProps) {
  const theme = useTheme();
  return (
    <>
      <Typography
        paragraph
        align="center"
        boxShadow={2}
        color={theme.palette.grey[700]}
      >
        <Typography
          component="span"
          color={theme.palette.text.primary}
          fontSize={12}
        >
          {"Use this URL > "}
        </Typography>
        {url}
        <CopyToClipboardButton message={url} />
      </Typography>
    </>
  );
}
