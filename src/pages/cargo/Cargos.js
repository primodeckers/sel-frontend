import React, {useState, useEffect} from 'react';
import ContentSection from '../../components/content-section/ContentSection';
import CustomTable from '../../components/table/Table';
import { Container, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Switch, Route } from "react-router-dom";

import Cadastro from '../cadastro/Cadastro';
import api from '../../services/api';
import CargoForm from '../cargo/CargoForm';

const useStyles = makeStyles(theme => ({
    pageContainer: {
      maxWidth: '1680px',
    },
    buttonText: {
        color: 'white',
        marginBottom: '3rem'
    },
    toolBar: {
        textAlign: 'right',
        marginTop: '1.5rem'
    },
    tituloContainer: {
        paddingTop: '3rem',
        maxWidth: '1680px',
        paddingLeft: '4rem',
    }
  }));


export default function Cargos(){

    const classes = useStyles();

    const [data, setData] = useState([]);    

    const keys = ['dsc_cargo'];

    const [change, setChange] = useState(0);

    const [id, setId] = useState(null);

    const dataArray = {
        key: '',
        innerKey: '',
    }

 

    const pesquisar = (texto) => {
        const fetchData = async () => {
            if(Boolean(texto)){
                try {
                    const result = await api.get(`/filter-cargo/${texto}`);
                    setData(result.data);
                } catch (error) {
                    console.log(error);
                }
                
            } else{
                const result = await api.get("/cargos");
                setData(result.data);
            }
        }
        fetchData();
    }

    const atualizar = () => {setChange(change => ++change);
    setId(null)};


    useEffect( () => {
        const fetchData = async () => {
            const result = await api.get("/cargos");
            setData(result.data);
           // setKeys(Object.keys(result.data[0]).slice(1,2));
        }
        fetchData();
    }, [change]);

    const colunas = ["Cargo"];

    const deletarCArgos = async (key) => {
        await api.delete(`/cargos/${key}`)
    }

    const handleEdit = (id) => {
        setId(id);
    }



    return(
        <ContentSection>
             <Container className={classes.tituloContainer}>
                <Typography variant={'h4'}>
                    CARGOS
                </Typography>
            </Container>
            <Switch>
                <Route exact path={'/cargos/cadastro'}>
                    <Cadastro>
                        <CargoForm atualizar={atualizar} id={id} />
                    </Cadastro>
                </Route>
                <Route>                    
                    <Container className={classes.pageContainer}>
                        <Grid container>
                            <Grid item xs={12}>
                                <CustomTable pesquisar={pesquisar} dataArray={dataArray} path={'/cargos/cadastro'} edit={handleEdit} colunas={colunas} chaves={keys} data={data} atualizar={atualizar} deletar={deletarCArgos} />
                            </Grid>
                            <Grid item xs={12}>
                                <hr/>
                            </Grid>
                            <Grid item xs={12} className={classes.toolBar}>
                                <Button component={Link} to='/cargos/cadastro' size={'large'} className={classes.buttonText} variant={'contained'} color={'primary'}>Novo Cargo</Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Route>
            </Switch>
        </ContentSection>
    )
}



