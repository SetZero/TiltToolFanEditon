import './styles/MainApp.css';

// riot api key (https://developer.riotgames.com/apis)
var riot_api_key = process.env.REACT_APP_API_KEY;
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
        <p>{riot_api_key}</p>
      </header>
    </div>
  );
}

export default MainApp;
