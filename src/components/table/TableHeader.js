import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    gridContainer: {
      paddingTop: 40,
      paddingLeft: 80,
      paddingRight: 80,
    },
  }));

export default function TableHeader(){

    const classes = useStyles();

    return(
        <Grid container className={classes.gridContainer}>
            <Grid item xs={2} align={'left'}>
            </Grid>
            <Grid item xs={2}>
                <Typography align={'left'}>Teste</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography align={'left'}>Teste</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography align={'left'}>Teste</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography align={'left'}>Teste</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography align={'left'}>Teste</Typography>
            </Grid>
        </Grid>
    )
}