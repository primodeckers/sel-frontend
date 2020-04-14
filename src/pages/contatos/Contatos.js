import React, {useState, useEffect} from 'react';
import ContentSection from '../../components/content-section/ContentSection';
import CustomTable from '../../components/table/Table';
import { Container, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Switch, Route } from "react-router-dom";
import Cadastro from '../cadastro/Cadastro';
import api from '../../services/api';
import PessoaForm from '../pessoa/PessoaForm';
import Tooltip from '@material-ui/core/Tooltip';

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
    tituloForm: {
        marginBottom: '2rem'
    }
  }));

export default function Contatos(){

    const classes = useStyles();

    const [data, setData] = useState([]);
   
    const keys = ['nom_pessoa', 'dsc_byname', 'dsc_email', 'patente', ];

    const cellArray = {
        key: 'telefones',
        innerKey: 'telefone'
    };

    const [change, setChange] = useState(0);

    const [id, setId] = useState(null);

    const atualizar = () => {setChange(change => ++change);
    setId(null)};
    


    useEffect( () => {
        const fetchData = async () => {
            const result = await api.get("/full-person");
            const formatted = result.data;
            formatted.forEach((element) => {
                element.telefones = element.tel_by_pessoa.map((item) => ({
                    id: item.id,
                    telefone: `${item.tip_fone}: ${item.num_telefone}`
                }))
            });
            setData(formatted);
        }
        fetchData();
    }, [change]);
    

    const colunas = ["Nome", "Codinome", "E-Mail", "Patente", "Telefones"];

    const deletarPessoa = async (key) => {                    
        await api.delete(`/pessoas/${key}`)
    }

 
    const handleEdit = (id) => {
        setId(id);
    }

    const pesquisar = (texto) => {
        const fetchData = async () => {
            if(Boolean(texto)){
                try {
                    const result = await api.get(`/filter-person/${texto}`);
                    const formatted = result.data;
                    formatted.forEach((element) => {
                        element.telefones = element.tel_by_pessoa.map((item) => ({
                            id: item.id,
                            telefone: `${item.tip_fone}: ${item.num_telefone}`
                        }))
                    });
                    setData(result.data);
                } catch (error) {
                    console.log(error);
                }
                
            } else{
                const result = await api.get("/full-person");
                const formatted = result.data;
                formatted.forEach((element) => {
                    element.telefones = element.tel_by_pessoa.map((item) => ({
                        id: item.id,
                        telefone: `${item.tip_fone}: ${item.num_telefone}`
                    }))
                });
                setData(result.data);
            }
        }
        fetchData();
    }


    return(
        <ContentSection>
            <Container className={classes.tituloContainer}>
                <Typography variant={'h4'}>
                    CONTATOS
                </Typography>
            </Container>
            <Switch>
                <Route exact path={'/contatos/cadastro'}>
                    <Cadastro>
                        <PessoaForm atualizar={atualizar} id={id} />
                    </Cadastro>
                </Route>
                <Route>
                    {/* <TableSwitch/> */}
                    <Container className={classes.pageContainer}>
                        <Grid container>
                            <Grid item xs={12}>
                                <CustomTable pesquisar={pesquisar} dataArray={cellArray} path={'/contatos/cadastro'} edit={handleEdit} colunas={colunas} chaves={keys} data={data} atualizar={atualizar} deletar={deletarPessoa} />
                            </Grid>
                            <Grid item xs={12}>
                                <hr/>
                            </Grid>
                            <Grid item xs={12} className={classes.toolBar}>
                            <Tooltip title="Cadastrar nono" placement="top">
                            <Button component={Link} to='/contatos/cadastro' size={'large'} className={classes.buttonText} variant={'contained'} color={'primary'}>Novo Contato</Button>
                            </Tooltip>
                                
                            </Grid>                            
                        </Grid>
                    </Container>
                </Route>
            </Switch>
        </ContentSection>
    )
}

