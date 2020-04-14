import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import { Link, useHistory } from "react-router-dom";
import { isAuthenticated, logout, getPerfil, getUsername } from '../../services/auth';
import rules from "../../configs/TopbarLinks";

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: theme.palette.primary.main,
    },
    title: {
      flexGrow: 1,
      color: theme.palette.primary.main,
      fontWeight: 100,
    },
    navbar: {
        backgroundColor: 'white',
    },
    navButton: {
        marginRight: '2rem',
        fontWeight: 400,
    },
    menuItem: {
      color: theme.palette.primary.main,
      fontWeight: 100
    }
  }));

export default function Topbar(props) {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [perfil, setPerfil] = React.useState(getPerfil());
  const [name, setName] = React.useState(getPerfil());
  const [title, setLink] = useState(rules.filter((item) => item.perfil.includes(getPerfil())));

  // console.log(getPerfil());

  const handleSignOut = async => {
    logout();
    history.push("/");     
};



  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setLink(rules.filter((item) => item.perfil.includes(getPerfil())));
    setPerfil(getPerfil());
    setName(getUsername());
    
}, [history.location]);

  if(!isAuthenticated()){      
    return null;
  }

  return (
    
    <div className={classes.root}>
     
    
        <AppBar position="static" elevation={0} className={classes.navbar}>
        
          <Toolbar variant="dense">
            
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="top-bar" aria-controls="top-bar" aria-haspopup="true" onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              elevation={0}
              id="top-bar"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              marginThreshold={0}
              PaperProps={{square: true}}
            >
              
              {/* {title.map((item) => 
                <MenuItem key={item.title} component={Link} to={item.path} onClick={handleClose} className={classes.menuItem}>{item.title}
                </MenuItem>
                
              )} */}
              <MenuItem component={Link} to="/" onClick={handleSignOut} className={classes.menuItem}>Sair</MenuItem>
            </Menu>
            
            
              <Typography variant="h5" align={'left'} className={classes.title}>
                <Link to="/dashboard" style={{textDecoration:'none'}} className={classes.title}>
                  SEL  
                  
                  </Link>
                  
                  
              </Typography>
              
            {title.map((item) => 
              <Button key={item.title} component={Link} to={item.path} color={item.path === history.location.pathname ? "primary" : "inherit"} className={classes.navButton}>{item.title}</Button>
              
            )}

              
{name}<PersonIcon  />  {perfil} 
          
          </Toolbar>
        </AppBar>
    </div>
  );
}