import React, {useState, useEffect} from 'react';
import ContentSection from '../../components/content-section/ContentSection';
import CustomTable from '../../components/table/Table';
import { Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from "react-router-dom";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import BlockIcon from '@material-ui/icons/Block';
import { green, red } from '@material-ui/core/colors';

import Cadastro from '../cadastro/Cadastro';
import api from '../../services/api';
import CargoForm from '../usuario/UsuarioForm';

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
    },
  
  }));

const keys = ['name', 'email', 'perfil', 'samaccountname', 'situacao'];

export default function Usuarios(){

    const classes = useStyles();

    const [data, setData] = useState([]);
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
                    const result = await api.get(`/filter-user/${texto}`);
                    setData(result.data);
                } catch (error) {}
            } else{
                const result = await api.get("/users");
                setData(result.data);
            }
        }
        fetchData();
    }

    const atualizar = () => {setChange(change => ++change);
    setId(null)};

    useEffect( () => {
        const fetchData = async () => {
            const result = await api.get("/users");
            const parsed = result.data.map((item) => {   
                
                    item.situacao === "1" ? item.situacao = <CheckCircleIcon style={{ color: green[400] }} /> : item.situacao  = <BlockIcon style={{ color: red[500] }}/>;
                               
                return item;
            })
            setData(parsed);
        }
        fetchData();
    }, [change]);

    const colunas = ["Nome", "Email", "Perfil", "Username", "Situação"];

    const deletarCArgos = async (key) => {
        await api.delete(`/users/${key}`)
    }

    const handleEdit = (id) => {
        setId(id);
    }

    return(
        <ContentSection>
             <Container className={classes.tituloContainer}>
                <Typography variant={'h4'}>
                    USUÁRIOS
                </Typography>
            </Container>
            <Switch>
                <Route exact path={'/users/cadastro'}>
                    <Cadastro>
                        <CargoForm atualizar={atualizar} id={id} />
                    </Cadastro>
                </Route>
                <Route>                    
                    <Container className={classes.pageContainer}>
                        <Grid container>
                            <Grid item xs={12}>
                                <CustomTable pesquisar={pesquisar} dataArray={dataArray} path={'/users/cadastro'} edit={handleEdit} colunas={colunas} chaves={keys} data={data} atualizar={atualizar} deletar={deletarCArgos} />
                            </Grid>
                            <Grid item xs={12}>
                                <hr/>
                            </Grid>
                            <Grid item xs={12} className={classes.toolBar}>
                               
                            </Grid>
                        </Grid>
                    </Container>
                </Route>
            </Switch>
        </ContentSection>
    )
}



