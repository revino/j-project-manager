import React, {useState}from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: '1px solid gray;',
    },
  },
});

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        
      },
    },
  }))(TableRow);
  

function createData(id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content ) {
  return {
    id, 
    progress, 
    company, 
    line, 
    pl, 
    pic, 
    start, 
    end, 
    pjtno, 
    pjtname,
    content
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <StyledTableRow  className={classes.root}>
        <TableCell >
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell >
        <TableCell  align="center" component="th" scope="row">
          {row.id}
        </TableCell >
        <TableCell  align="center">{row.progress}</TableCell >
        <TableCell  align="center">{row.pjtname}</TableCell >
        <TableCell  align="center">{row.company}</TableCell >
        <TableCell  align="center">{row.pic}</TableCell >
        <TableCell  align="center">{row.pl}</TableCell >
        <TableCell  align="center">{row.start}</TableCell >
        <TableCell  align="center">{row.end}</TableCell >
        <TableCell  align="center">{row.pjtno}</TableCell >
      </StyledTableRow >
      <StyledTableRow >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                내용물<br />{row.content}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </StyledTableRow >
    </React.Fragment>
  );
}

const rows = [
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
  createData(1, "진행중", "Hynix", "mvp", "PL01", "사람01", "2020-07-30", "2020-08-30", "E-HYN 1", "PJT NAME 01","asdfasdf\ndsafa\n" ),
];

export default function CollapsibleTable(props) {
  const [tableData,setTableData] = useState(props.data);
  return (
    
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">상태</StyledTableCell>
            <StyledTableCell align="center">PJT 이름</StyledTableCell>
            <StyledTableCell align="center">사이트</StyledTableCell>
            <StyledTableCell align="center">담당자</StyledTableCell>
            <StyledTableCell align="center">PL</StyledTableCell>
            <StyledTableCell align="center">시작일</StyledTableCell>
            <StyledTableCell align="center">종료일</StyledTableCell>
            <StyledTableCell align="center">번호</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
