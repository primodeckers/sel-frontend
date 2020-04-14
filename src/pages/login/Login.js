import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2'

import { Grid, Paper, Typography, TextField, Box, Button } from '@material-ui/core';
import useLoginForm from './LoginHook';
import api from "../../services/api";
import { login, userSession, userPerfil } from "../../services/auth";


const useStyles = makeStyles(theme => ({
    gridContainer: {
      minHeight: '100vh',
    },
    leftGrid: {
        backgroundColor: 'white',
        maxHeight: '95vh',
    },
    rightGrid: {
        backgroundColor: theme.palette.primary.main,
        borderBottomLeftRadius: '10rem',
        maxHeight: '95vh'
    },
    loginForm: {
        maxWidth: '480px',
        padding: '2.5rem',
        height: 'fit-content'
    },
    formWidth: {
        width: '320px'
    },
    inputMargin: {
        marginBottom: '1rem'
    },
    button: {
        marginTop: '1.5rem',
        color: 'white'
    },
    subTitle: {
        fontWeight: 200
    }
  }));

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    allowEscapeKey: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })  

export default function Login(props){

    const classes = useStyles();
    
    const handleSignIn = async e => {
        const { sAMAccountName, password } = inputs;
        if (!sAMAccountName || !password) {
            Toast.fire({
                icon: 'error',
                title: 'Preencha os dados corretamente'
              })           
        } else {
          try {
            const response = await api.post("/login", { sAMAccountName, password });           
            if(!response.data.situacao){
                Toast.fire({
                    icon: 'error',
                    title: 'User Inativo'
                  })  
            } else {
                login(response.data.token);
                userSession(response.data.samaccountname);
                userPerfil(response.data.perfil)                
                
                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully! '
                  }) 
            }
           
              props.history.push("/dashboard");
              const user = response.data;                       
              return user;     
              
            
          } catch (err) {
            Toast.fire({
                icon: 'error',
                title: 'Algo de errado aconteceu, favor contatar a codes '
              })
           
          }
        }
      };

    const {inputs, handleInputChange, handleSubmit} = useLoginForm(handleSignIn);


    return(
    
        <Grid container>
            <Grid item className={classes.leftGrid} md={5}>
                <Box marginLeft={'7rem'} height={'100%'} display={'flex'} alignItems={'center'}>
                    <Box>
                        <Typography variant={'h2'} align={'left'} gutterBottom color={'primary'}>
                            SEL
                        </Typography >
                        <Typography variant={'h4'} align={'left'} color={'primary'} className={classes.subTitle}>
                            Sistema de Encaminhamento
                        </Typography>
                        <Typography variant={'h4'} align={'left'} color={'primary'} className={classes.subTitle}>
                            de Ligações
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item md={7}>
                <Grid container className={classes.gridContainer}>
                    <Grid item className={classes.rightGrid} md={12}>
                        <Box display={'flex'} height={'100%'} alignItems={'center'} justifyContent={'center'}>
                            <Paper className={classes.loginForm}>
                                <Typography gutterBottom align={'left'} variant={'h4'} color={'primary'}>
                                    Login
                                </Typography>
                                <form className={classes.formWidth} onSubmit={handleSubmit}>
                                    <TextField
                                        id="sAMAccountName"
                                        label="Usuário"
                                        color={'primary'}
                                        type={'text'}
                                        name={'sAMAccountName'}
                                        required
                                        fullWidth
                                        className={classes.inputMargin}
                                        onChange={handleInputChange}
                                        value={inputs.usuario}
                                    />
                                    <TextField
                                        id="password"
                                        label="Senha"
                                        color={'primary'}
                                        type={'password'}
                                        name={'password'}
                                        required
                                        fullWidth
                                        className={classes.inputMargin}
                                        onChange={handleInputChange}
                                        value={inputs.senha}
                                    />
                                <Button type="submit" className={classes.button} variant={'contained'} color={'primary'} size={'large'}>Entrar</Button>
                                </form>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}