import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, FormGroup, Typography, CircularProgress, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddBoxIcon from '@material-ui/icons/AddBox';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import Swal from 'sweetalert2'

import {useForm} from 'react-hook-form';
import api from '../../services/api';

import {useHistory} from 'react-router-dom';

import MaskedInput from 'react-text-mask';

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    const checkCell = input => {
        if (input > 14) {
          return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        } else {
            return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        }
      };
  
    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={checkCell(props.tamanho)}
        placeholderChar={'\u2000'}
      />
    );
  }



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

  export default function EntidadeForm(props){
  
    const classes = useStyles();
   

    const [data, setData] = useState(); 
    const [indexes, setIndexes] = React.useState([]);
    const [counter, setCounter] = React.useState(0);


    const { register, handleSubmit, reset, watch } = useForm();
    const campos = watch();

    const history = useHistory();

    useEffect( () => {
        const fetchRegistro = async (id) => {
            const result = await api.get(`/entidadeWithPhones/${id}`).then((res) => {
                res.data.phones.forEach((item, index) => {
                    res.data[`phones[${index}].id`] = item.id;
                    res.data[`phones[${index}].num_telefone`] = item.num_telefone;                   
                })
               
                setIndexes(() => {
                    const arr = [];
                    for (let index = 0; index < res.data.phones.length; index++) {
                        arr.push(index);
                    }
                    return arr;
                }); 
                setCounter(res.data.phones.length);
               
                return res.data;
            });
           
           

           setData(result);
          
           
        }
        if(props.id){
            fetchRegistro(props.id);
        }
    }, [props.id, setIndexes]);

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
      

      const addPhones = () => {
        setIndexes(prevIndexes => [...prevIndexes, counter]);
        setCounter(prevCounter => prevCounter + 1);
    };  

     

    const onSubmit = async data => {

        const { sig_entidade, dsc_entidade, dsc_logradouro, dsc_email, phones } = data;   

        if(props.id){             
            try {
                await api.patch(`/entidades/${props.id}`, { sig_entidade, dsc_entidade, dsc_logradouro, dsc_email }).then(async (res) => {    
                  
                    const id_entidade = res.data.id;    
                                                                                     
                    (phones || []).filter(item => item).map(async item => {       
                                           
                        const { num_telefone, id } = item;                         
                                         
                        if(!id) {
                            await api.post("/entidade-telefones", {id_entidade, num_telefone})
                        } else {                                                                                        
                            await api.put(`/entidade-telefones/${id}`, {id_entidade, num_telefone})
                        } 
    
                    })

                })
             
                history.push("/entidades"); 
               
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
            
                await api.post("/entidades", { sig_entidade, dsc_entidade, dsc_logradouro, dsc_email })
                .then(async (res) => {                              
                    (phones || []).filter(item => item).map(async (item) => {
                        const id_entidade = res.data.id;                                         
                        const { num_telefone } = item;    
                        await api.post("/entidade-telefones", {id_entidade, num_telefone});                       
                    });               
                
                history.push("/entidades"); 
                Toast.fire({
                    icon: 'success',
                    title: 'Salvo com sucesso!'
                  })
                props.atualizar();           
              
            }
          
        )}
}
 
    const removeTelefone = index => async () => {    
              
        const id  = data[`phones[${index}].id`];   
        
           
        Swal.fire({
            title: 'Você Tem Certeza?',
            text: 'Se você deletar o registro, não poderá mais recupera-lo!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Não, manter',
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
          }).then( (result) => {        
                if (result.value && id) {
                    api.delete(`/entidade-telefones/${id}`);
                     setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
                    Swal.fire(
                      'Deletado!',
                      'Registro delatado com sucesso.',
                      'success'
                    )
                    
                  }           
          }) 
        
      
    }


    const handleCancelar = () => {
        history.push("/entidades"); 
        props.atualizar();
    }


    const selectPhones = (index) => {
        const fieldName = `phones[${index}]`;
        return(
            <FormGroup row key={index}>
                <input type={'hidden'} name={`${fieldName}.id`} ref={register} />
                <Input
                    label="Número"
                    color={'primary'}
                    inputRef={register}
                    name={`${fieldName}.num_telefone`}
                    className={classes.inline}
                    type={'tel'}
                    InputLabelProps={{shrink: Boolean(campos[`${fieldName}.num_telefone`])}}
                    inputComponent={TextMaskCustom}
                    inputProps={{tamanho: (campos[`${fieldName}.num_telefone`] || '').trim().length}}
                    required
                />
                <Button onClick={removeTelefone(index)}><RemoveCircleIcon color={'secondary'} /></Button>
                
            </FormGroup>
    )};


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
                    label="Entidade"
                    color={'primary'}
                    inputRef={register}
                    fullWidth
                    name="dsc_entidade"
                    InputLabelProps={{shrink: Boolean(campos.dsc_entidade)}}
                    required
                />
                
                <TextField
                    label="Sigla"
                    color={'primary'}
                    className={classes.inline}
                    inputRef={register}
                    name="sig_entidade"
                    InputLabelProps={{shrink: Boolean(campos.sig_entidade)}}
                />

                <TextField
                    name="dsc_email"
                    label="E-mail"
                    className={classes.inline}
                    color={'primary'}
                    inputRef={register}
                    InputLabelProps={{shrink: Boolean(campos.dsc_email)}}
                />   
               
                <TextField
                    label="Endereço"
                    color={'primary'}
                    fullWidth
                    className={classes.inline}
                    inputRef={register}
                    name="dsc_logradouro"
                    InputLabelProps={{shrink: Boolean(campos.dsc_logradouro)}}
                />
                                     
                </FormGroup>

                <div>
                    <Typography display={'inline'} className={classes.telefones} color={'primary'} variant={'h6'}>Telefones</Typography>
                    <Button onClick={addPhones} className={classes.iconButton}><AddBoxIcon color={'primary'} fontSize={'large'} /></Button>
                    {indexes.map(index => selectPhones(index))}
                </div>
                
                <Grid container className={classes.buttonContainer}>
                    <Button size={'large'} className={classes.buttonStyle} onClick={handleCancelar} >Cancelar</Button>
                    <Button size={'large'} className={classes.buttonStyle}  type="submit">Salvar</Button>
                </Grid>
            </div>
        </form>
    )

  }