import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
    width: 30,
    height: 30,
    
    
  },
  extendedIcon: {
    marginRight: theme.spacing(1),

  },
}));

export default function DeleteButton() {
  const classes = useStyles();

  return (
    <Tooltip title="Editar" placement="top" arrow>
      <Fab color="primary"  aria-label="TurnOff" className={classes.fab}>
        <EditIcon fontSize={'small'} />
      </Fab>
    </Tooltip>
      
  );
}