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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

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
    this.state = { playerInfo: {} };


  }

  componentDidMount() {
    this.listener = (e) => {
      let data = e.detail;
      console.log(data);
      this.setState(state => ({ playerInfo: data }));
    };

    document.addEventListener("tilttool/match/playerinfo", this.listener);
  }

  componentWillUnmount() {
    document.removeEventListener("tilttool/match/playerinfo", this.listener);
  }

  summonerInfoTable() {
    return (
      <Container maxWidth="sm">
        {Object.entries(this.state.playerInfo).map(([key, value]) => (
          <Card key={key}>
            <CardMedia
              component="img"
              height="30"
              image="https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Lulu_3.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">{key}</Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Last Matches</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Champion</StyledTableCell>
                          <StyledTableCell align="right">KDA</StyledTableCell>
                          <StyledTableCell align="right">Position</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {value.map((row, index) => (
                          <StyledTableRow key={index} win={row.win}>
                            <StyledTableCell align="right">{row.championName}</StyledTableCell>
                            <StyledTableCell align="right">{row.kills} - {row.deaths} - {row.assists}</StyledTableCell>
                            <StyledTableCell align="right">{row.teamPosition}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>))}
      </Container>);
  }

  render() {
    let matchTable = Object.keys(this.state.playerInfo).length > 0 ? this.summonerInfoTable() : <div>Wating for match to start...</div>;

    const mystyle = {
      WebkitAppRegion: "drag",
    };

    return (
      <div className="MainApp">
        <header className="MainApp-header">
          <h1 style={mystyle}>Tilt Tool</h1>
          {matchTable}
        </header>
      </div>
    );
  }
}

export default MainApp;
