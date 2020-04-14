import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, FormGroup, FormControl, InputLabel, NativeSelect, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Switch.css';
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

  export default function UsuarioForm(props){
  
    const classes = useStyles();

    const { register, handleSubmit, reset, watch } = useForm();
   
    const [data, setData] = useState();
    
    const [ situacao, setSituacao ] = useState();        
     
    const campos = watch();

    const history = useHistory();

    useEffect( () => {
        const fetchRegistro = async (id) => {
            const result = await api.get(`/user-by-id/${id}`)  
                    setData(result.data);
                    var variavel = false
                    if(result.data.situacao === "1"){
                        variavel = true
                    }else {
                        variavel = false                    }
                     
                    setSituacao(variavel)
                                           
           
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

      

        const payload = {
            name: data.name,
            email: data.email,
            perfil: data.perfil,
            samaccountname: data.samaccountname,
            situacao: situacao ? 1 : 0
        }       
        
          
        if(props.id){             
            try {
             
               
                
                await api.patch(`/users/${props.id}`, payload);
                history.push("/users"); 
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
                await api.post("/users", payload);            
                history.push("/users"); 
                Toast.fire({
                    icon: 'success',
                    title: 'Salvo com sucesso!'
                  })
                props.atualizar();                 
            }          
}

    const handleCancelar = () => {
        history.push("/users"); 
        props.atualizar();
    }  

    if(props.id && !data){
        return(
            <div className={classes.loading}>
                <CircularProgress/>
            </div>
        )
    }    

    const Switch = ({ isOn, handleToggle, onColor }) => {
     
        return (
          <>             
            <input            
              checked={isOn}
              onChange={handleToggle}
              className="react-switch-checkbox"              
              id={`react-switch-new`}
              type="checkbox"               
            />
            <label
                style={{ background: isOn && onColor }}
                className="react-switch-label"
                htmlFor={`react-switch-new`}
            >
              <span className={`react-switch-button`} />
            </label>
          </>
        );
      };

      console.log(situacao)

    return(      
       
             
        <form onSubmit={handleSubmit(onSubmit)}>            
            <div>            
                <FormGroup row>                
                <TextField
                    disabled 
                    label="Nome"
                    color={'primary'}
                    className={classes.inline}
                    inputRef={register}
                    name="name"
                    InputLabelProps={{shrink: Boolean(campos.name)}}                   
                />

                <TextField
                    disabled 
                    label="Email"
                    color={'primary'}
                    className={classes.inline}
                    inputRef={register}
                    name="email"
                    InputLabelProps={{shrink: Boolean(campos.email)}}                   
                />
               
                <FormControl>
                    <input type={'hidden'} ref={register} name={'id'}   />
                    <InputLabel htmlFor="tipo-select">Tipo</InputLabel>
                    <NativeSelect 
                    inputProps={{name: 'perfil', id: 'tipo-select'}} 
                    inputRef={register}>
                        <option value={'Administrador'} >Administrador</option>
                        <option value={'Atendente'} >Atendente</option>
                        <option value={'Telefonista'} >Telefonista</option>
                    </NativeSelect>
                </FormControl>
                
                <TextField
                disabled 
                    label="Username"
                    color={'primary'}
                    className={classes.inline}
                    inputRef={register}
                    name="samaccountname"
                    InputLabelProps={{shrink: Boolean(campos.samaccountname)}}                   
                />

               
                <FormControl>
                    <p>Situação</p>
                    <input type={'hidden'} ref={register} name={'situacao'}   />
                        <Switch           
                          isOn={situacao}
                          onColor="orange"
                          handleToggle={() => setSituacao(!situacao)}                                                                            
                        />
                </FormControl>

                

                </FormGroup>                          
                <Grid container className={classes.buttonContainer}>
                    <Button size={'large'} className={classes.buttonStyle} onClick={handleCancelar} >Cancelar</Button>
                    <Button size={'large'} className={classes.buttonStyle}  type="submit">Salvar</Button>
                </Grid>
            </div>
        </form>
    )

  }