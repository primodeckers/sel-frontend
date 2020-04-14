import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, FormGroup, CircularProgress, FormControl, InputLabel, NativeSelect  } from '@material-ui/core';
import 'moment';
import MomentAdapter from "@material-ui/pickers/adapter/moment";
import 'moment/locale/pt-br';
import {
	MuiPickersUtilsProvider,
	DateTimePicker,
  } from '@material-ui/pickers'

import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';


import Swal from 'sweetalert2'
import api from '../../services/api';
import {useHistory} from 'react-router-dom';
import moment from 'moment';
moment.locale('pt-br')

const useStyles = makeStyles(theme => ({
	root: {
		width: 500,
		'& > * + *': {
		  marginTop: theme.spacing(2),
		},
	  },

	buttonContainer: {
		paddingTop:'2rem',
		paddingBottom: '1rem',
		justifyContent:'space-around'

	},
	buttonStyle: {
		backgroundColor: 'lightgray',
	},
	inline: {
		marginTop: '0em',
		minWidth: '19rem',
		marginRight: 'auto',
		paddingLeft: '0rem',
		marginLeft: '0rem',
		marginBottom: '0rem'
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
	},
	entidades: {

		marginTop: '0.2rem',
		minWidth: '22rem',
		height: '1rem',
		paddingLeft: '0rem',
		marginLeft: '2rem',
		marginBottom: '2rem'
	  },
	  autoridade: {

		marginTop: '1rem',
		minWidth: '19rem',
		height: '1rem',
		paddingLeft: '0rem',
		marginLeft: '0.5rem',
		marginBottom: '2rem'
	  },
	  localOrigem: {

		marginTop: '0.8rem',
		minWidth: '19rem',
		height: '1rem',
		paddingLeft: '0rem',
		marginLeft: '0rem',
		marginBottom: '2rem'
	  },

	  localDestino: {

		marginTop: '0.8rem',
		minWidth: '19rem',
		height: '1rem',
		paddingLeft: '0rem',
		marginLeft: '0.3rem',
		marginBottom: '2rem'
	  },
	  informanteOrigem: {

		marginTop: '0.3rem',
		minWidth: '19rem',
		height: '1rem',
		paddingLeft: '0rem',
		marginLeft: '0rem',
		marginBottom: '2rem'
	  },
	  informanteDestino: {

		marginTop: '0.3rem',
		minWidth: '19rem',
		height: '1rem',
		paddingLeft: '0.3rem',
		marginLeft: '0rem',
		marginBottom: '2rem'
	  }
  }));

  export default function DeslocamentoForm(props){

	const classes = useStyles();
	const [ data, setData ] = useState();

	const [ persons, setPersons ] = useState();
	const [ locais, setlocais ] = useState();


	const [ autoridade, setAutoridade ] = useState();
	const [ informanteOrigem, setInformanteOrigem ] = useState();
	const [ informanteDestino, setInformanteDestino ] = useState();
	const [ localOrigem, setLocalOrigem ] = useState();
	const [ localDestino, setLocalDestino ] = useState();



	const { register, handleSubmit, reset, watch, control } = useForm();
	const campos = watch();

	const history = useHistory();

	const defaultPropsPersons = {
		options: persons,
		getOptionLabel: option => option.nom_pessoa,
	  };

	  const defaultPropsLocais = {
		options: locais,
		getOptionLabel: option => option.dsc_localidade,
	  };



	useEffect( () => {
		const fetchPessoas = async () => {
			const result = await api.get("/pessoas");
			setPersons(result.data);
		}
			fetchPessoas();
	}, []);

	useEffect( () => {
		const fetchLocaisOrigem = async () => {
			const result = await api.get("/localidades");
			setlocais(result.data);
		}
		fetchLocaisOrigem();
	}, []);

	useEffect( () => {
		const fetchRegistro = async (id) => {
			const result = await api.get(`/deslocamento-by-id/${id}`)
					if(result.data.dat_desloca_origem){
						result.data.dat_desloca_origem = moment(result.data.dat_desloca_origem);
					}
					if(result.data.dat_desloca_destino){
						result.data.dat_desloca_destino = moment(result.data.dat_desloca_destino);
					}
					setData(result.data);
					setAutoridade(result.data.autoridade);
					setLocalOrigem(result.data.local_origem);
					setInformanteOrigem(result.data.informante_origem);
					setInformanteDestino(result.data.informante_destino);
					setLocalDestino(result.data.local_destino);
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

	const onSubmit = async (data) => {
		

		const payload = {
			tip_deslocamento: data.tip_deslocamento,
			id_autoridade: autoridade ? autoridade.id : '',
			id_local_origem: localOrigem ? localOrigem.id : '',
			dat_desloca_origem: data.dat_desloca_origem ? data.dat_desloca_origem.format('YYYY-MM-DD HH:mm:ss') : '',
			id_informante_origem: informanteOrigem ? informanteOrigem.id : '',
			id_local_destino: localDestino ? localDestino.id : '',
			dat_desloca_destino: data.dat_desloca_destino ? data.dat_desloca_destino.format('YYYY-MM-DD HH:mm:ss') : '',
			id_informante_destino: informanteDestino ? informanteDestino.id : ''
		}



		if(props.id){
		  try {
				await api.patch(`/deslocamentos/${props.id}`, payload);

				history.push("/deslocamentos");
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
				await api.post("/deslocamentos", payload);
				history.push("/deslocamentos");
				Toast.fire({
					icon: 'success',
					title: 'Salvo com sucesso!'
				  })
				props.atualizar();

			}

}




	const handleCancelar = () => {
		history.push("/deslocamentos");
		props.atualizar();
	}





	if(props.id && !data){
		return(
			<div className={classes.loading}>
				<CircularProgress/>
			</div>
		)

	}


	const AutoSuggestionAutoridade= () => {

		return(
			<FormControl>
				{/* <input type={'hidden'} ref={register} name={'autoridade'} /> */}
				<Autocomplete
						{...defaultPropsPersons}
						id="id_autoridade"
						value={autoridade}
						onChange={(event, autoridade) => {
						setAutoridade(autoridade);
						}}
						renderInput={params => (
						<TextField {...params}  margin="normal" className={classes.autoridade}
						placeholder="Autoridade"
						InputLabelProps={{shrink: Boolean(campos.autoridade)}} />
						)}
					/>
			</FormControl>
		)
	}

	const AutoSuggestionLocalOrigem = () => {
		return(
			<FormControl>

				{/* <input type={'hidden'} ref={register} name={'localOrigem'} /> */}
				<Autocomplete
						{...defaultPropsLocais}
						id="id_local_origem"
						value={localOrigem}
						onChange={(event, localOrigem) => {
						setLocalOrigem(localOrigem);
						}}
						renderInput={params => (
						<TextField {...params}  margin="normal" className={classes.localOrigem}
						inputRef={register}
						name="localOrigem"
						placeholder="Local/Origem"
						InputLabelProps={{shrink: Boolean(campos.localOrigem)}} />
						)}
					/>
			</FormControl>
		)
	}

	const AutoSuggestionLocalDestino = () => {
		return(
			<FormControl>

				{/* <input type={'hidden'} ref={register} name={'LocalDestino'} /> */}
				<Autocomplete
						{...defaultPropsLocais}
						id="id_local_destino"
						value={localDestino}
						onChange={(event, localDestino) => {
						setLocalDestino(localDestino);
						}}
						renderInput={params => (
						<TextField {...params}  margin="normal" className={classes.localDestino}
						inputRef={register}
						name="localDestino"
						placeholder="Local/Destino"
						InputLabelProps={{shrink: Boolean(campos.localDestino)}} />
						)}
					/>
			</FormControl>
		)
	}

	const AutoSuggestionInformanteOrigem = () => {
		return(
			<FormControl>

				{/* <input type={'hidden'} ref={register} name={'informanteOrigem'} /> */}
				<Autocomplete
						{...defaultPropsPersons}
						id="id_informante_origem"
						value={informanteOrigem}
						onChange={(event, informanteOrigem) => {
							setInformanteOrigem(informanteOrigem);
						}}
						renderInput={params => (
						<TextField {...params}  margin="normal" className={classes.informanteOrigem}
						inputRef={register}
						name="informanteOrigem"
						placeholder="Informante/Origem"
						InputLabelProps={{shrink: Boolean(campos.informanteOrigem)}} />
						)}
					/>
			</FormControl>
		)
	}



	const AutoSuggestionInformanteDestino = () => {
		return(
			<FormControl>

				{/* <input type={'hidden'} ref={register} name={'informanteDestino'} /> */}
				<Autocomplete
						{...defaultPropsPersons}
						id="id_informante_destino"
						value={informanteDestino}
						onChange={(event, informanteDestino) => {
						setInformanteDestino(informanteDestino);
						}}
						renderInput={params => (
						<TextField {...params}  margin="normal" className={classes.informanteDestino}
						inputRef={register}
						name="informanteDestino"
						placeholder="Informante/Destino"
						InputLabelProps={{shrink: Boolean(campos.informanteDestino)}} />
						)}
					/>
			</FormControl>
		)
	}

	if(!(persons && locais) || (props.id && !data)){
		return(
			<div className={classes.loading}>
				<CircularProgress  size={90} className={classes.fabProgress}/>
			</div>
		)
	}

	return(
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<FormGroup row>
				<FormControl >
					<input type={'hidden'} ref={register} name={'id'}   />
					<InputLabel shrink={Boolean(campos.tip_deslocamento)} htmlFor="tipo-select">Deslocamento</InputLabel>
					<NativeSelect className={classes.inline}
					inputProps={{name: 'tip_deslocamento', id: 'tipo-select'}}
					inputRef={register}
					required>
						<option></option>
						<option value={'Presidente em Exercicio'} >Presidente em Exercicio</option>
						<option value={'Presidente da Republica'} >Presidente da Republica</option>
						<option value={'ESCAV'} >ESCAV</option>
						<option value={'Presidente da Camara'} >Presidente da Camara</option>
						<option value={'Presidente do Senado'} >Presidente do Senado</option>
						<option value={'Supremo Tribunal Federal'} >Supremo Tribunal Federal</option>
						<option value={'Vice Presidente da Republica'} >Vice Presidente da Republica</option>
					</NativeSelect>
				</FormControl>

				<AutoSuggestionAutoridade />

				<MuiPickersUtilsProvider libInstance={moment} utils={MomentAdapter} locale={moment.locale('pt-br')}>

					<Controller
						as={<DateTimePicker
							label="Data/Origem"
							color={'primary'}
							className={classes.inline}
							InputLabelProps={{shrink: true}}
							format="dd/MM/yyyy HH:mm"
							autoOk
						/>}
						// onChange={([mom, value]) => {
						//     console.log(value);
						//     return [mom, value]
						// }}
						format="DD/MM/YYYY HH:mm"
						name="dat_desloca_origem"
						control={control}
						defaultValue={() => {
							if(!props.id) return null;
						}}
					/>
						<Controller
						as={<DateTimePicker
							label="Data/Destino"
							color={'primary'}
							className={classes.inline}
							InputLabelProps={{shrink: true}}
							format="dd/MM/yyyy HH:mm"
							autoOk
						/>}
						// onChange={([mom, value]) => value}
						format="DD/MM/YYYY HH:mm"
						name="dat_desloca_destino"
						control={control}
						defaultValue={() => {
							if(!props.id) return null;
						}}
					/>



				</MuiPickersUtilsProvider>

				<AutoSuggestionLocalOrigem />
				<AutoSuggestionLocalDestino />
				<AutoSuggestionInformanteOrigem />
				<AutoSuggestionInformanteDestino />



				</FormGroup>
				<Grid container className={classes.buttonContainer}>
					<Button size={'large'} className={classes.buttonStyle} onClick={handleCancelar} >Cancelar</Button>
					<Button size={'large'} className={classes.buttonStyle}  type="submit">Salvar</Button>
				</Grid>

			</div>
		</form>
	)



  }

