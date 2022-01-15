import './styles/MainApp.css';

// LCU api documentation: https://lcu.vivide.re/

window.ipcRenderer.send('mainWindowReady', {ready: true});

function MainApp() {
  return (
    <div className="MainApp">
      <header className="MainApp-header">
        <h1>Main Application</h1>
        <div id='player-info'></div>
      </header>
    </div>
  );
}

export default MainApp;
