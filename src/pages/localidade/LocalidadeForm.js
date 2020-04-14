import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, FormGroup, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';



import Swal from 'sweetalert2'

import {useForm} from 'react-hook-form';
import api from '../../services/api';

import {useHistory} from 'react-router-dom';



const useStyles = makeStyles(theme => ({
    buttonContainer: {
        paddingTop:'2rem',
        paddingBottom: '1rem',
        justifyContent:'space-around'

    },
    buttonStyle: {
        backgroundColor: 'lightgray',
    },
    inline: {
        width: '100%',
        marginRight: 'auto'
    },
    select: {
        minWidth: '4rem',
        marginRight: '1rem'
    },
    telefones: {
        marginTop: '1rem'
    },
    loading: {
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }    
  }));

  export default function LocalidadeForm(props){
  
    const classes = useStyles();
    const [data, setData] = useState();
    const { register, handleSubmit, reset, watch } = useForm();
    const campos = watch();

    const history = useHistory();

    useEffect( () => {
        const fetchRegistro = async (id) => {
            const result = await api.get(`/localidade-by-id/${id}`)  
                    setData(result.data);                       
           
        }
        if(props.id){
            fetchRegistro(props.id);
        }
    }, [props.id]);

    useEffect( () => {
        reset(data);
    }, [data, reset]);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        padding: '1.25rem',
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      

      

    const onSubmit = async data => {

        const { dsc_localidade } = data;   

        if(props.id){             
            try {
                await api.patch(`/localidades/${props.id}`, { dsc_localidade });
                history.push("/localidades"); 
                Toast.fire({
                    icon: 'success',
                    title: 'Atualizado com sucesso!'              
                  })       
                  props.atualizar(); 
               
                
            } catch (err) {
                
                Toast.fire({
                    icon: 'error',
                    title: 'Erro inesperado'
                  })               
            }
          } else{            
                await api.post("/localidades", { dsc_localidade });            
                history.push("/localidades"); 
                Toast.fire({
                    icon: 'success',
                    title: 'Salvo com sucesso!'
                  })
                props.atualizar();
           
              
            }
          
        
}


    const handleCancelar = () => {
        history.push("/localidades"); 
        props.atualizar();
    }


  

    if(props.id && !data){
        return(
            <div className={classes.loading}>
                <CircularProgress/>
            </div>
        )
    }

    return(       
        
        <form onSubmit={handleSubmit(onSubmit)}>
            
            <div>
            
                <FormGroup row>                
                <TextField
                    label="Local"
                    color={'primary'}
                    className={classes.inline}
                    inputRef={register}
                    name="dsc_localidade"
                    InputLabelProps={{shrink: Boolean(campos.dsc_localidade)}}                   
                />

          
             
                                                      
                </FormGroup>                          
                <Grid container className={classes.buttonContainer}>
                    <Button size={'large'} className={classes.buttonStyle} onClick={handleCancelar} >Cancelar</Button>
                    <Button size={'large'} className={classes.buttonStyle}  type="submit">Salvar</Button>
                </Grid>
            </div>
        </form>
    )

  }