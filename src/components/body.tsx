import { Grid } from "@mui/material";
import { RequestEvent } from "./drawer";
import JsonCard from "./json-card";

export type BodyProps = {
  requestEvent?: RequestEvent;
};

export default function Body({ requestEvent }: BodyProps) {

  return (
    <Grid container spacing={1}>
      {requestEvent ? (
        <>
          <Grid item xs={6}>
            <JsonCard title="Body" json={requestEvent.body} />
          </Grid>
          <Grid item xs={6}>
            <JsonCard title="Headers" json={requestEvent.headers} />
          </Grid>
        </>
      ) : null}
    </Grid>
  );
}
