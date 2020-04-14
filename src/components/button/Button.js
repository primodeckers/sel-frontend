import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleOutlineSharpIcon from '@material-ui/icons/RemoveCircleOutlineSharp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';



const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
    width: 35,
    height: 35
    
  },
  extendedIcon: {
    marginRight: theme.spacing(1),

  },
}));

export default function Button() {
  const classes = useStyles();

  return (
    <div>
      {/* <Fab color="primary"  aria-label="TurnOff" className={classes.fab}>
        <RemoveCircleOutlineSharpIcon style={{fontSize: '32px' }} />
      </Fab>
      <Fab color="secondary" aria-label="edit" className={classes.fab}>
        <EditIcon />
      </Fab> */}    
      <FontAwesomeIcon icon="coffee" />      
    </div>
  );
}