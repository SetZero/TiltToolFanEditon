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
import LinearProgress from '@mui/material/LinearProgress';

import { Box, CircularProgress } from '@mui/material';

import {PlayerDataProcessUtil} from '../utils/PlayerDataProcessUtil';

import { PlayerStatsCard, PlayerStatsIcon} from '../utils/MUIUtils';

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
    this.state = { playerInfo: {}, startfetch: false };

    this.playerDataProcessUtil = new PlayerDataProcessUtil();
  }

  componentDidMount() {
    this.champSelectListener = (e) => {
      let data = e.detail;
      console.log(data);
      this.setState(state => ({ playerInfo: data, startfetch: false }));
    };

    this.champSelectQuitListener = (e) => {
      this.setState(state => ({ playerInfo: {}, startfetch: false }));
    };

    this.startFetchListener = (e) => {
      this.setState(state => ({ startfetch: true }));
    };

    document.addEventListener("tilttool/match/playerinfo", this.champSelectListener);
    document.addEventListener("tilttool/match/quitchampselect", this.champSelectQuitListener);
    document.addEventListener("tilttool/match/startfetch", this.startFetchListener);
  }

  componentWillUnmount() {
    document.removeEventListener("tilttool/match/playerinfo", this.champSelectListener);
    document.removeEventListener("tilttool/match/quitchampselect", this.champSelectQuitListener);
    document.removeEventListener("tilttool/match/startfetch", this.startFetchListener);
  }

  summonerInfoTable() {
    // debug
    console.log(this.state.playerInfo);
    return (
      <Container maxWidth="sm">
        {Object.entries(this.state.playerInfo).map(([key, value]) => (
          <Card key={key}>
            <CardMedia
              component="img"
              height="30"
              image={"https://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key)  + "_0.jpg"} 
              alt={this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key)}
            />
            
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" >{key}</Typography>

              {/*<PlayerStatsCard 
                championWinrate={43}  
                championImageSrc={this.playerDataProcessUtil.getChampionImageByChampionId(this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key))} 
                championName={this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key)}
              />
              <PlayerStatsCard 
                championWinrate={43}  
                championImageSrc={this.playerDataProcessUtil.getChampionImageByChampionId(this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key))} 
                championName={this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key)}
              />*/}

              
              <PlayerStatsIcon
                championWinrate={42}  
                championImageSrc={this.playerDataProcessUtil.getChampionImageByChampionId(this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key))} 
                championName={this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key)}
              />
               <PlayerStatsIcon
                championWinrate={42}  
                championImageSrc={this.playerDataProcessUtil.getChampionImageByChampionId(this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key))} 
                championName={this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key)}
              />
               <PlayerStatsIcon
                championWinrate={42}  
                championImageSrc={this.playerDataProcessUtil.getChampionImageByChampionId(this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key))} 
                championName={this.playerDataProcessUtil.getChampionName(this.state.playerInfo, key)}
              />



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
    let matchTable = Object.keys(this.state.playerInfo).length > 0 && !this.state.startfetch
      ? this.summonerInfoTable()
      : <Typography color="textPrimary">Wating for match to start...</Typography>;

    let loadingInfo = this.state.startfetch ? (
      <div>
        <LinearProgress color="primary" />
        <Typography variant="body2" color="textPrimary" component="p">
          Match started, fetching match data...
        </Typography>
      </div>
    ) : null;

    const mystyle = {
      WebkitAppRegion: "drag",
      textAlign: "center",
    };

    return (
      <div className="MainApp">
        <header className="MainApp-header">
          <Typography variant="h3" style={mystyle} color="textPrimary">Tilt Tool</Typography>
          {loadingInfo}
          {matchTable}
        </header>
      </div>
    );
  }
}

export default MainApp;
