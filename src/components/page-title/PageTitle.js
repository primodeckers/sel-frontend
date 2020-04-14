import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    title: {
        alignSelf: 'end',
        marginRight: '4rem',
        marginBottom: '2rem'
    }
}));

export default function PageTitle(props){
    
    const classes = useStyles();

    return(
        <Typography variant={'h3'} className={classes.title}>
            {props.title}
        </Typography>
    )

}