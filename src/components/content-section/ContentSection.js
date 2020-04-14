import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    contentSection: {
        backgroundColor: '#f0f0f0',
        minHeight: '95vh',
        minWidth: '170vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'orange',
        // paddingTop: 60
    }
  }));

  export default function ContentSection(props) {

    const classes = useStyles();

      return(
          <div className={classes.contentSection}>
              {props.children}
          </div>
      )
  }