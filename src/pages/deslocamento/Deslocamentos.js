import React, {useState, useEffect} from 'react';
import ContentSection from '../../components/content-section/ContentSection';
import CustomTable from '../../components/table/Table';
import { Container, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Switch, Route } from "react-router-dom";

import Cadastro from '../cadastro/Cadastro';
import api from '../../services/api';
import DeslocamentoForm from '../deslocamento/DeslocamentoForm';

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


export default function Deslocamentos(){

    const classes = useStyles();

    const [data, setData] = useState([]);

    const [keys, setKeys] = useState([]);

    const [change, setChange] = useState(0);

    const [id, setId] = useState(null);

    const cellArray = {
        key: '',
        innerKey: ''
    };
    

    const pesquisar = (texto) => {
        const fetchData = async () => {
            if(Boolean(texto)){
                try {
                    const result = await api.get(`/filter-deslocamento/${texto}`);
                    setData(result.data);
                } catch (error) {
                    console.log(error);
                }
                
            } else{
                const result = await api.get("/deslocamento-full");
                setData(result.data);
            }
        }
        fetchData();
    }

    const atualizar = () => {setChange(change => ++change);
    setId(null)};


    useEffect( () => {
        const fetchData = async () => {
            const result = await api.get("/deslocamento-full");
            setData(result.data);
            setKeys(Object.keys(result.data[0]).slice(1,10));
        }
        fetchData();
    }, [change]);

    const colunas = ["Autoridade","Data/Origem", "Local/Origem", "Informante/Origem", "Data/Destino", "Local/Destino", "Informante/Destino", "Modificado", "Cadastrado Por"];

    const deletarDeslocamento = async (key) => {
        await api.delete(`/deslocamentos/${key}`)
    }

    const handleEdit = (id) => {
        setId(id);
    }



    return(
        <ContentSection>
             <Container className={classes.tituloContainer}>
                <Typography variant={'h4'}>
                    DESLOCAMENTOS
                </Typography>
            </Container>
            <Switch>
                <Route exact path={'/deslocamentos/cadastro'}>
                    <Cadastro>
                        <DeslocamentoForm atualizar={atualizar} id={id} />
                    </Cadastro>
                </Route>
                <Route>                    
                    <Container className={classes.pageContainer}>
                        <Grid container>
                            <Grid item xs={12}>
                                <CustomTable pesquisar={pesquisar}  dataArray={cellArray} path={'/deslocamentos/cadastro'} edit={handleEdit} colunas={colunas} chaves={keys} data={data} atualizar={atualizar} deletar={deletarDeslocamento} />
                            </Grid>
                            <Grid item xs={12}>
                                <hr/>
                            </Grid>
                            <Grid item xs={12} className={classes.toolBar}>
                                <Button component={Link} to='/deslocamentos/cadastro' size={'large'} className={classes.buttonText} variant={'contained'} color={'primary'}>Novo Deslocamento</Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Route>
            </Switch>
        </ContentSection>
    )
}



