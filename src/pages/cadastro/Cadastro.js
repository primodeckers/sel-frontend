import React from 'react';
import ContentSection from '../../components/content-section/ContentSection';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    containerFit: {
        maxWidth: '200 0px'
    },
    formContainer: {
        padding: '2rem',
        width: '100%'
    },
    buttonStyle: {
        backgroundColor: 'lightgray',
        marginLeft: '1.5rem',
        marginRight: '1.5rem'
    }
  }));


export default function Cadastro(props){

    const classes = useStyles();

    return(
        <ContentSection>
            <Container className={classes.containerFit}>
                <Grid container>
                    <Grid item xs={6}>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container>                           
                            <Grid item xs={12}>
                                <Paper className={classes.formContainer}>
                                    <Typography paragraph align={'left'} variant={'h4'} color={'primary'}>
                                        Cadastro
                                    </Typography>
                                    {props.children}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </ContentSection>
    )
}