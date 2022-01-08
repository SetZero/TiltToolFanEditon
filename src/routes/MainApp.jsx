import './styles/MainApp.css';

// LCU api documentation: https://lcu.vivide.re/

function getCurrentSummoner()
{
  window.ipcRenderer.send('summoner', {cmd: 'current-summoner', method:'GET'});
}

async function riot_test()
{
  const x = await window.ipcRenderer.invoke('riot-summoner', {cmd: 'me', method:'GET'});
  console.log(x);
}

function MainApp() {
  return (
    <div className="MainApp">
      <header className="MainApp-header">
        <h1>Main Application</h1>
        <button onClick={() => getCurrentSummoner()}>get current summoner</button>
        <button onClick={() => riot_test()}>riot-api-test</button>
      </header>
    </div>
  );
}

export default MainApp;
