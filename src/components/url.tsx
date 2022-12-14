import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import CopyToClipboardButton from "./copy-button";

export type UrlProps = {
  url: string;
  disabled: boolean;
};

export default function Url({ url, disabled }: UrlProps) {
  const theme = useTheme();
  return (
    <Box
      style={{
        boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
        fontSize:
          window.innerWidth > theme.breakpoints.values.sm ? "1rem" : "0.75rem",
      }}
    >
      <Typography
        paragraph
        align="center"
        color={theme.palette.grey[700]}
        component="div"
      >
        {disabled ? (
          <>
            {"Generating link... "}
            <CircularProgress size={12} />
          </>
        ) : (
          <>
            {url}
            <CopyToClipboardButton message={url} disabled={disabled} />
          </>
        )}
      </Typography>
    </Box>
  );
}
