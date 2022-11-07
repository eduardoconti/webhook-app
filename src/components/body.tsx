import { Grid } from "@mui/material";
import { RequestEventProps } from "../hooks/useRequestEvent";
import JsonCard from "./json-card";

export type BodyProps = {
  requestEvent?: RequestEventProps;
};

export default function Body({ requestEvent }: BodyProps) {

  return (
    <Grid container spacing={1}>
      {requestEvent ? (
        <>
          <Grid item xs={12} md={6}>
            <JsonCard title="Body" json={requestEvent.body} />
          </Grid>
          <Grid item xs={12} md={6}>
            <JsonCard title="Headers" json={requestEvent.headers} />
          </Grid>
        </>
      ) : null}
    </Grid>
  );
}
