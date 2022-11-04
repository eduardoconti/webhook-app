import { Divider, Grid } from "@mui/material";
import { Requests } from "./drawer";
import JsonCard from "./json-card";

export type BodyProps = {
  requestEvent?: Requests;
};

export default function Body({ requestEvent }: BodyProps) {

  return (
    <Grid container spacing={1}>
      {requestEvent ? (
        <>
          <Grid item xs={5}>
            <JsonCard title="Body" json={requestEvent.body} />
          </Grid>
          <Grid item xs={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item xs={6}>
            <JsonCard title="Headers" json={requestEvent.headers} />
          </Grid>
        </>
      ) : null}
    </Grid>
  );
}
