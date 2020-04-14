import React from 'react';
import { Typography, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import './HomePageStyle.css';
import ContentSection from '../../components/content-section/ContentSection';
import { flexbox } from '@material-ui/system';

import SimpleLineChart from "../../Graphics/SimpleLineChart";
import SimpleBarChart from "../../Graphics/SimpleBarChart";
import AreaChartFillByValue from "../../Graphics/AreaChartFillByValue";
import SimpleAreaChart from "../../Graphics/SimpleAreaChart";

const useStyle = makeStyles(theme => ({

  gridContainer: {
    minHeight: '50vh',
    flexGrow: 1,
    
  },
  leftGrid: {
    backgroundColor: 'white',
    maxHeight: '50vh',
    paddingTop: '56.25%'
  },
  rightGrid: {
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: '10rem',
    maxHeight: '95vh',
    paddingTop: '56.25%',
       
  },
  card: {
    display: flexbox,
    width: 500,
    height: 350,
    marginTop: 40,
    borderRadius: 12,
    paddingRight: 5,
    paddingLeft:5,    
   
    
  },
  title: {
    fontSize: 25,
    marginTop: 100,
    fontFamily: 'Arial',
    fontStyle: 'bold',
  }
}));


export default function HomePage() {



  const classes = useStyle();

  return (
    <ContentSection>
      <Grid container >
        <Grid item xs={6}>
          <Box height={'100%'} display={'flex'} alignItems={'center'}>
            <Box>
              <Typography variant={'h2'} align={'left'} gutterBottom color={'primary'}>
                SEL 
              </Typography >
              <Typography variant={'h2'} align={'left'} gutterBottom color={'primary'}>
                Sistema de Encaminhamento
              </Typography>
              <Typography variant={'h2'} align={'left'} gutterBottom color={'primary'}>
                de Ligações
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={6} style={{ textDecoration: 'none' }}>
              {/* Primeiro card */}
              <Card className={classes.card}>
                <SimpleBarChart />
              </Card>
            </Grid>
            
            <Grid item xs={6} style={{ textDecoration: 'none' }} >
              {/* Primeiro card */}
              <Card className={classes.card}>
                <SimpleLineChart />
              </Card>
            </Grid>
            <Grid item xs={6} style={{ textDecoration: 'none' }}>
              {/* Primeiro card */}
              <Card className={classes.card}>
                <AreaChartFillByValue />
              </Card>
            </Grid>
            <Grid item xs={6} style={{ textDecoration: 'none' }}>
              {/* Primeiro card */}
              <Card className={classes.card}>
                <SimpleAreaChart />
              </Card>
            </Grid>



            

          
          </Grid>
        </Grid>
      </Grid>
    </ContentSection>
  )
}

