import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';


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

export default function DeleteButton() {
  const classes = useStyles();

  return (
    <Tooltip title="Deletar" placement="top" arrow>
       <Fab color="secondary"  aria-label="TurnOff" className={classes.fab}>
        <DeleteIcon fontSize={'small'} />
      </Fab>
    </Tooltip>
     
  );
}