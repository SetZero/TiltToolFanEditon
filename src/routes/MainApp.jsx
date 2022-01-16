import './styles/MainApp.css';
import React from 'react';
import { styled, makeStyles } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// LCU api documentation: https://lcu.vivide.re/

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'win',
})(({ win }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: win ? "#7ba65a" : "#b3615b",
  },
  '&:nth-of-type(even)': {
    backgroundColor: win ? "#5d8f36" : "#993f39",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerInfo: [] };

    document.addEventListener("tilttool/match/playerinfo", (e) => {
      let data = e.detail;
      this.setState(state => ({ playerInfo: data }));
    });
  }

  summonerInfoTable() {
    return (<TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Champion</StyledTableCell>
            <StyledTableCell align="right">KDA</StyledTableCell>
            <StyledTableCell align="right">Position</StyledTableCell>
            <StyledTableCell align="right">Win</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.playerInfo.map((row) => (
            <StyledTableRow key={row.name} win={row.win}>
              <StyledTableCell component="th" scope="row">{row.summonerName}</StyledTableCell>
              <StyledTableCell align="right">{row.championName}</StyledTableCell>
              <StyledTableCell align="right">{row.kills} - {row.deaths} - {row.assists}</StyledTableCell>
              <StyledTableCell align="right">{row.teamPosition}</StyledTableCell>
              <StyledTableCell align="right">{row.win}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>);
  }

  render() {
    let matchTable = this.state.playerInfo.length > 0 ? this.summonerInfoTable() : <div>Wating for match to start...</div>;

    return (
      <div className="MainApp">
        <header className="MainApp-header">
          <h1>Main Application</h1>
          {matchTable}
        </header>
      </div>
    );
  }
}

export default MainApp;
