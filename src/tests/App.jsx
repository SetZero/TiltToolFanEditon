import logo from './logo.svg';
import './App.css';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CircularProgress color="secondary" />
        We are using Node.js <span id="node-version"></span>,
        Chromium <span id="chrome-version"></span>,
        and Electron <span id="electron-version"></span>
      </header>
    </div>
  );
}

export default App;
