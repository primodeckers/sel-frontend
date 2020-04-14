import { Button, FormControl, FormGroup, Grid, InputLabel, NativeSelect, TextField, Typography, CircularProgress, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddBoxIcon from '@material-ui/icons/AddBox';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { fetchCargo, fetchEntidade, fetchPessoas, fetchPessoaForm, submitPessoaForm } from '../../helpers/PessoaFormCalls';
import api from '../../services/api';
import { blue } from '@material-ui/core/colors';
import MaskedInput from 'react-text-mask';
import Autocomplete from '@material-ui/lab/Autocomplete'

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    const checkCell = tipo => {
        if (tipo === "Celular") {
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
        mask={checkCell(props.tipo)}
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
        marginLeft: '2rem',
        marginRight: '0rem'
    },
    select: {
        minWidth: '4rem',
        marginRight: '1rem'
    },
    iconButton: {
        alignSelf: 'flex-end'
    },
    telefones: {
        marginTop: '1rem'
    },
    enderecos: {
        marginTop: '2rem'
    },
    cargos: {
        marginTop: '0rem',
        minWidth: '15rem',
        height: '1rem',
        marginBottom: '2rem',
        marginRight: '1rem',
        paddingRigth: 'auto',
        marginLeft: 'auto'
      },

      entidades: {
        
        marginTop: '0rem',
        minWidth: '21rem',
        height: '1rem',  
        paddingLeft: 'auto',   
        marginLeft: 'auto',  
        marginBottom: '2rem'
      },

      vinculados: {
        marginTop: '0rem',
        minWidth: '30rem',
        height: '1rem',
        marginBottom: '2rem',
        marginRight: '1rem',
        paddingRigth: 'auto',
        marginLeft: 'auto'
      },

      loading: {
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      },
      fabProgress: {
        color: blue[500],
        position: 'absolute',
      
      },

  }));

export default function PessoaForm(props){
  
    const { register, handleSubmit, reset, watch, control } = useForm();
    const campos = watch();

    const classes = useStyles();
    const [data, setData] = useState();
    const [dataEntidades, setEntidades] = useState();
    const [dataCargos, setCargos] = useState();
    const [dataVinculados, setVinculados] = useState();
 
    const [indexes, setIndexes] = useState([]);
    const [indexesEnds, setIndexesEnds] = useState([]);
    const [indexesCargos, setIndexesCargos] = useState([]);
    const [indexesVinculados, setIndexesVinculados] = useState([]);
   
  
    const [counter, setCounter] = useState(0);
    const [counterEnds, setCounterEnds] = useState(0);
    const [counterCargos, setCountercargos] = useState(0);
    const [counterVinculados, setCounterVinculados] = useState(0);

    const [cargo, setCargo] = useState([]);
    const [entidade, setEntidade] = useState([]);
    const [vinculado, setVinculado] = useState([]);

    const history = useHistory();

    const defaultPropsCargos = {
		options: dataCargos,
		getOptionLabel: option => option.dsc_cargo,
    };
      
    const defaultPropsEntidades = {
		options: dataEntidades,
		getOptionLabel: option => option.dsc_entidade,
    };

    const defaultPropsVinculados = {
		options: dataVinculados,
		getOptionLabel: option => option.nom_pessoa || option.nomefilho,
    };
    
    useEffect( () => {
        fetchEntidade(setEntidades);
        fetchCargo(setCargos);
        fetchPessoas(setVinculados);
        if(props.id){
            fetchPessoaForm(props.id, setIndexes, setCounter, setIndexesEnds, setCounterEnds,
                 setIndexesCargos, setCountercargos, setIndexesVinculados, setCounterVinculados, 
                 setData, setVinculado, setCargo, setEntidade);
        }
    }, [props.id]);

    useEffect(() => {
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
    });

    const addPhones = () => {
        setIndexes(prevIndexes => [...prevIndexes, counter]);
        setCounter(prevCounter => prevCounter + 1);
    };  

    const addCargos = () => {
        setIndexesCargos(prevIndexes => [...prevIndexes, counterCargos]);
        setCountercargos(prevCounter => prevCounter + 1);
        
    };  

    const addEnds = () => {
        setIndexesEnds(prevIndexes => [...prevIndexes, counterEnds]);
        setCounterEnds(prevCounter => prevCounter + 1);
    };

    const addVinculados = () => {
        setIndexesVinculados(prevIndexes => [...prevIndexes, counterVinculados]);
        setCounterVinculados(prevCounter => prevCounter + 1);
    };
   
    const removeTelefone = index => async () => {
        if(data){
        const id  = campos[`telefones[${index}].id`];
       
        if(id){
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
                    api.delete(`/telefones/${id}`);
                    setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]);

                    Swal.fire(
                        'Deletado!',
                        'Registro delatado com sucesso.',
                        'success'
                    )
                    
                    }     
        })
        } else{
            setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
        }}else{
            setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
        }
        
        
    }

    const removeEndereco = index => async () => {
        if(data){
        const id  = data[`enderecos[${index}].id`];

            if(id){
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
                        api.delete(`/enderecos/${id}`);
                        setIndexesEnds(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
                        
                        Swal.fire(
                            'Deletado!',
                            'Registro delatado com sucesso.',
                            'success'
                        )
                        
                        }     
            })
            }else{
                setIndexesEnds(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
            }
        } else{
            setIndexesEnds(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
        }
    }

    const removeCargo = index => async () => {
        if(data){
     
        const id  = data[`cargoEntidade[${index}].id`];
        if(id){
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
                    api.delete(`/entidade-cargo-orgao/${id}`);
                    setIndexesCargos(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
                    setCargo(prevCargo => {
                        prevCargo[index] = '';
                        return prevCargo;
                    });
                    setEntidade(prevEntidade => {
                        prevEntidade[index] = '';
                        return prevEntidade;
                    });
                    
                    Swal.fire(
                        'Deletado!',
                        'Registro delatado com sucesso.',
                        'success'
                    )
                    
                    }     
        })
        } else{
            setIndexesCargos(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
            setCargo(prevCargo => {
                prevCargo[index] = {};
                return prevCargo;
            });
            setEntidade(prevEntidade => {
                prevEntidade[index] = '';
                return prevEntidade;
            });
        }}else{
            setIndexesCargos(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
            setCargo(prevCargo => {
                prevCargo[index] = {};
                return prevCargo;
            });
            setEntidade(prevEntidade => {
                prevEntidade[index] = {};
                return prevEntidade;
            });
        }
        
    }

    const removeVinculado = index => async () => {

        if(data){

        const id  = data[`vinculados[${index}].id`];
        if(id){
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
                    api.delete(`/vinculados/${id}`);
                    setIndexesVinculados(prevIndexes => [...prevIndexes.filter(item => item !== index)]); 
                    setVinculado(prevVinculado => {
                        prevVinculado[index] = {};
                        return prevVinculado;
                    });
                    Swal.fire(
                    'Deletado!',
                    'Registro delatado com sucesso.',
                    'success'
                    )
                    
                } 
        })}else{
            setIndexesVinculados(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
            setVinculado(prevVinculado => {
                prevVinculado[index] = {};
                return prevVinculado;
            });
        }}else{
            setIndexesVinculados(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
            setVinculado(prevVinculado => {
                prevVinculado[index] = {};
                return prevVinculado;
            });
        }
    }
      
    const onSubmit = async (data) => submitPessoaForm(data, props.id, history, Toast, props.atualizar, vinculado, cargo, entidade);
  

    const handleCancelar = () => {
        history.push("/contatos");
        props.atualizar();
    }

    const selectPhones = (index) => {
        const fieldName = `telefones[${index}]`;
        return(
            <FormGroup row key={index}>
                <FormControl>
                    <input type={'hidden'} ref={register} name={`${fieldName}.id`} />
                    <InputLabel htmlFor="tipo-select">Tipo</InputLabel>
                    <NativeSelect 
                    inputProps={{name: `${fieldName}.tip_fone`, id: 'tipo-select'}} 
                    inputRef={register}
                    InputLabelProps={{shrink: Boolean(campos[`${fieldName}.tip_fone`])}}>
                        <option value={'Funcional'} >Funcional</option>
                        <option value={'Celular'} >Celular</option>
                        <option value={'Residencial'} >Residencial</option>
                    </NativeSelect>
                </FormControl>
                <Input
                    label="Número"
                    color={'primary'}
                    inputRef={register}
                    name={`${fieldName}.num_telefone`}
                    className={classes.inline}
                    type={'tel'}
                    InputLabelProps={{shrink: Boolean(campos[`${fieldName}.num_telefone`])}}
                    inputComponent={TextMaskCustom}
                    inputProps={{tipo: campos[`${fieldName}.tip_fone`]}}
                    required
                />
                <Button onClick={removeTelefone(index)}><RemoveCircleIcon color={'secondary'} /></Button>
                
            </FormGroup>
    )};

    const selectEnderecos = (index) => {
        const fieldName = `enderecos[${index}]`;
        return(
            <FormGroup row key={index}>
                <FormControl>
                    <input type={'hidden'} ref={register} name={`${fieldName}.id`} />
                    <InputLabel htmlFor="tipo-select-ends">Tipo</InputLabel>
                    <NativeSelect inputProps={{name: `${fieldName}.tip_end`, id: 'tipo-select-ends'}} inputRef={register}
                    InputLabelProps={{shrink: Boolean(campos[`${fieldName}.tip_end`])}}>
                        <option value={'Funcional'} >Funcional</option>
                        <option value={'Residencial'} >Residencial</option>
                    </NativeSelect>
                </FormControl>
                <FormControl>
                    <TextField
                        label="Endereço"
                        color={'primary'}
                        inputRef={register}
                        name={`${fieldName}.dsc_logradouro`}
                        className={classes.inline}
                        type={'tel'}
                        InputLabelProps={{shrink: Boolean(campos[`${fieldName}.dsc_logradouro`])}}
                        required
                    />
                </FormControl>
                <Button onClick={removeEndereco(index)}><RemoveCircleIcon color={'secondary'} /></Button>
                
            </FormGroup>
    )};

 
    

    const selectCargos = (index) => { 
        const fieldName = `cargoEntidade[${index}]`;
        return(
        <FormGroup key={index} row >
            <input type={'hidden'} ref={register} name={`${fieldName}.id`} />
            <FormControl >
                <Autocomplete
                    {...defaultPropsCargos}
                    id="id_cargo"
                    value={cargo[index]}
                    onChange={(event, cargo) => {
                    setCargo(prevCargo => {
                        prevCargo[index] = cargo;
                        return prevCargo;
                    });
                    }}
                    renderInput={params => (
                    <TextField {...params}  margin="normal" 
                    placeholder="Cargo" required />
                    )}
                    className={classes.cargos}
                />  
            </FormControl>
            <FormControl>
                <Autocomplete
                    {...defaultPropsEntidades}
                    id="id_entidade"
                    value={entidade[index]}
                    onChange={(event, entidade) => {
                    setEntidade(prevEntidade => {
                        prevEntidade[index] = entidade;
                        return prevEntidade;
                    });
                    }}
                    renderInput={params => (
                    <TextField {...params}  margin="normal" 
                    placeholder="Entidade" required />
                    )}
                    className={classes.entidades}
                />
            </FormControl>
            <Button onClick={removeCargo(index)}><RemoveCircleIcon color={'secondary'} /></Button>
        </FormGroup>
    )};

    const selectVinculados = (index) => {
        const fieldName = `vinculados[${index}]`;   
        
      
        return(
            <FormGroup key={index} row >
                <FormControl >
                    <input type={'hidden'} ref={register} name={`${fieldName}.id`} />
                    <Autocomplete
                        {...defaultPropsVinculados}
                        id="id_vinculado"
                        value={vinculado[index]}
                        onChange={(event, vinculado) => {
                        setVinculado(prevVinculado => {
                            prevVinculado[index] = vinculado;
                            return prevVinculado;
                        });
                        }}
                        renderInput={params => (
                        <TextField {...params}  margin="normal"
                        placeholder="Vinculado" required />
                        )}
                        className={classes.vinculados}
                    />
                </FormControl>
                <Button onClick={removeVinculado(index)}><RemoveCircleIcon color={'secondary'} /></Button>
            </FormGroup>
    )};

    if(!(dataEntidades && dataCargos && dataVinculados) || (props.id && !data)){
        return(
            <div className={classes.loading}>
                <CircularProgress  size={90} className={classes.fabProgress}/>
            </div>
        )
    }
   return(
       
        
        <form onSubmit={handleSubmit(onSubmit)}>
            
            <div>
                <TextField
                    label="Nome"
                    required 
                    fullWidth
                    color={'primary'}
                    inputRef={register}
                    name="nom_pessoa"                    
                    InputLabelProps={{shrink: Boolean(campos.nom_pessoa)}}                    
                /> 
                  
                <TextField
                    label="Codinome"
                    color={'primary'}
                    fullWidth
                    inputRef={register}
                    name="dsc_byname"
                    InputLabelProps={{shrink: Boolean(campos.dsc_byname)}}
                />
                <TextField
                    label="Patente"
                    color={'primary'}
                    inputRef={register}
                    fullWidth
                    name="patente"
                    InputLabelProps={{shrink: Boolean(campos.patente)}}
                />
                  <TextField
                    name="dsc_email"
                    label="E-mail"
                    fullWidth
                    color={'primary'}
                    inputRef={register}
                    InputLabelProps={{shrink: Boolean(campos.dsc_email)}}
                />
                <div>
                <Typography display={'inline'} className={classes.telefones} color={'primary'} variant={'h6'}>Cargo/Entidade</Typography>
                <Button onClick={addCargos} className={classes.iconButton}><AddBoxIcon color={'primary'} fontSize={'large'} /></Button>
                {indexesCargos.map(index => selectCargos(index))}
               
                </div>
                <div>
                    <Typography display={'inline'} className={classes.telefones} color={'primary'} variant={'h6'}>Telefones</Typography>
                    <Button onClick={addPhones} className={classes.iconButton}><AddBoxIcon color={'primary'} fontSize={'large'} /></Button>
                    {indexes.map(index => selectPhones(index))}
                </div>
                <div>
                    <Typography display={'inline'} className={classes.telefones} color={'primary'} variant={'h6'}>Endereços</Typography>
                    <Button onClick={addEnds} className={classes.iconButton}><AddBoxIcon color={'primary'} fontSize={'large'} /></Button>
                    {indexesEnds.map(index => selectEnderecos(index))}
                </div>
                <div>
                    <Typography display={'inline'} className={classes.telefones} color={'primary'} variant={'h6'}>Vinculados</Typography>
                    <Button onClick={addVinculados} className={classes.iconButton}><AddBoxIcon color={'primary'} fontSize={'large'} /></Button>
                    {indexesVinculados.map(index => selectVinculados(index))}
                </div>
             
                <Grid container className={classes.buttonContainer}>
                    <Button size={'large'} className={classes.buttonStyle} onClick={handleCancelar} >Cancelar</Button>
                    <Button size={'large'} className={classes.buttonStyle}  type="submit">Salvar</Button>
                </Grid>
            </div>
        </form>
    )

}



