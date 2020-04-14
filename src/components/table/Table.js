import React, {useState, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TableHead, TableRow, TableCell, Table, Container, TableBody, TablePagination, TableSortLabel, TextField, Chip } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import DeleteButton from '../../components/button/DeleteButton';
import EditButton from '../../components/button/EditButton';
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2'




function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const CustomCell = styled(TableCell)({
    border: 'none',
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingLeft: '16px',
    paddingRight: '16px',
});
//construção dos estilos 
const useStyles = makeStyles(theme => ({
    gridContainer: {
      paddingTop: 40,
      maxWidth: '100%'
    },
    tableRow: {
        backgroundColor: 'white',
    },
    table: {
        borderCollapse: 'separate',
        borderSpacing: '0rem 0.2rem',
    },
    noBorder: {
        border: 'none',
    },
    roundBorder: {
        '&:first-child': {
            borderTopLeftRadius: '1.2rem',
            borderBottomLeftRadius: '1.2rem'
        },
        '&:last-child': {
            borderTopRightRadius: '1.2rem',
            borderBottomRightRadius: '1.2rem'
        },
        border: 'none',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
      },
    chip: {
        marginTop: '0.2rem',
        marginBottom:'0.1rem'
    }
  }));
  

export default function CustomTable(props){

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(props.chaves[0]);
    const history = useHistory();
    const [searchText, setSearchText] = useState('');

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
      };

    const createSortHandler = property => event => {
        handleRequestSort(event, property);
      };


    const colunas = props.colunas.map((nome, index) =>
    <CustomCell key={index} className={classes.roundBorder} sortDirection={orderBy === index ? order : false}>
        <TableSortLabel
        active={orderBy === props.chaves[index]}
        direction={order}
        onClick={createSortHandler(props.chaves[index])}
        >
            {nome}
            {orderBy === props.chaves[index] ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
        </TableSortLabel>
    </CustomCell>
    );

           

    const handleDelete = async (key) => {       
         

            Swal.fire({
                title: 'Você Tem Certeza?',
                text: 'Se você deletar o registro, não poderá mais recupera-lo!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, deletar!',
                cancelButtonText: 'Não, manter',
                cancelButtonColor: '#3085d6',
                confirmButtonColor: '#d33',
              }).then( async (result) => {        
                              
                    if (result.value) {
                        Swal.fire(
                          'Deletado!',
                          'Registro delatado com sucesso.',
                          'success'
                        )
                        await props.deletar(key)
                        await props.atualizar()
                      }              
              })        
        }      
    
const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      const handleEdit = (id) => {
          props.edit(id);
          history.push(props.path);
      }

    const handleSearchText = event => {
        setSearchText(event.target.value)
    };

    const handleSearch = event => {
        event.preventDefault();
        props.pesquisar(searchText);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.data.length - page * rowsPerPage);

      

    return(
        <Container className={classes.gridContainer}>
            <form onSubmit={handleSearch} >
                <TextField label={'Pesquisar'} value={searchText} onChange={handleSearchText} />
            </form>
            <Table size={'small'} className={classes.table}>
                <TableHead>
                    <TableRow>
                        {colunas}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stableSort(props.data, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => 
                        <TableRow hover className={classes.tableRow} key={row.id}>
                            {props.chaves.map((chave) => 
                            <CustomCell key={chave} className={classes.roundBorder}>{row[chave]}</CustomCell>)}
                            <CustomCell className={classes.roundBorder}>{(row[props.dataArray.key] || []).map((item) => (
                                <Fragment key={item.id}>
                                <Chip className={classes.chip} label={item[props.dataArray.innerKey]} />
                                <br/>
                                </Fragment>
                            ))}</CustomCell>
                            <CustomCell key={row.id} className={classes.roundBorder} align={'right'} >
                                <span  onClick={() => handleDelete(row.id)}><DeleteButton /></span>
                                <span  onClick={() => handleEdit(row.id)}><EditButton /></span>
                            </CustomCell>
                        </TableRow>
                    )}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: (53) * emptyRows }}>
                            <TableCell colSpan={props.colunas.length + 1} />
                        </TableRow>
                    )} 
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={props.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                'aria-label': 'página anterior',
                }}
                nextIconButtonProps={{
                'aria-label': 'página seguinte',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage="Registros por página:"
            />
        </Container>
    )
}

