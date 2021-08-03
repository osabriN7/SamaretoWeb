import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

export default function NestedGrid({matrix = [] }) {
  const classes = useStyles();
  function FormRow({ data = [] }) {
    return (
      <React.Fragment>
        {data.map((d) => (
          <Grid item xs={3}>
            <Paper className={classes.paper}>{d}</Paper>
          </Grid>
        ))}
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container>
        {matrix.map((d) => (
          <Grid container item xs={12}>
            <FormRow data={d} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
