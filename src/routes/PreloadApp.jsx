import './styles/PreloadApp.css';
import CircularProgress from '@mui/material/CircularProgress';

function PreloadApp() {
  return (
    <div className="PreloadApp">
      <header className="PreloadApp-header">
        <CircularProgress color="secondary" />
        We are using Node.js <span id="node-version"></span>,
        Chromium <span id="chrome-version"></span>,
        and Electron <span id="electron-version"></span>
      </header>
    </div>
  );
}

export default PreloadApp;
