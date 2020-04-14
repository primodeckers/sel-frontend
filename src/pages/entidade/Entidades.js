import React, {useState, useEffect} from 'react';
import ContentSection from '../../components/content-section/ContentSection';
import CustomTable from '../../components/table/Table';
import { Container, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Switch, Route } from "react-router-dom";

import Cadastro from '../cadastro/Cadastro';
import api from '../../services/api';
import EntidadeForm from '../entidade/EntidadeForm';

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


export default function Entidades(){

    const classes = useStyles();

    const [data, setData] = useState([]);

    const [keys, setKeys] = useState([]);

    const [change, setChange] = useState(0);

    const [id, setId] = useState(null);

    const cellArray = {
        key: 'phones',
        innerKey: 'num_telefone'
    };

    const pesquisar = (texto) => {
        const fetchData = async () => {
            if(Boolean(texto)){
                try {
                    const result = await api.get(`/filter-entity/${texto}`);
                    setData(result.data);
                } catch (error) {
                    console.log(error);
                }
                
            } else{
                const result = await api.get("/full-entitys");
                setData(result.data);
            }
        }
        fetchData();
    }

    const atualizar = () => {setChange(change => ++change);
    setId(null)};


    useEffect( () => {
        const fetchData = async () => {
            const result = await api.get("/full-entitys");
            setData(result.data);
            setKeys(Object.keys(result.data[0]).slice(1,5)); 
        }
        fetchData();
    }, [change]);

    const colunas = ["Sigla","Entidade", "Logradouro", "Email", "telefones"];

    const deletarEntidade = async (key) => {
        await api.delete(`/entidades/${key}`)
    }

    const handleEdit = (id) => {
        setId(id);
    }



    return(
        <ContentSection>
             <Container className={classes.tituloContainer}>
                <Typography variant={'h4'}>
                    ENTIDADES
                </Typography>
            </Container>
            <Switch>
                <Route exact path={'/entidades/cadastro'}>
                    <Cadastro>
                        <EntidadeForm atualizar={atualizar} id={id} />
                    </Cadastro>
                </Route>
                <Route>                    
                    <Container className={classes.pageContainer}>
                        <Grid container>
                            <Grid item xs={12}>
                                <CustomTable pesquisar={pesquisar}  dataArray={cellArray} path={'/entidades/cadastro'} edit={handleEdit} colunas={colunas} chaves={keys} data={data} atualizar={atualizar} deletar={deletarEntidade} />
                            </Grid>
                            <Grid item xs={12}>
                                <hr/>
                            </Grid>
                            <Grid item xs={12} className={classes.toolBar}>
                                <Button component={Link} to='/entidades/cadastro' size={'large'} className={classes.buttonText} variant={'contained'} color={'primary'}>Nova Entidade</Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Route>
            </Switch>
        </ContentSection>
    )
}



