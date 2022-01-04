import './styles/MainApp.css';

var riot_api_key = process.env.REACT_APP_API_KEY;

function MainApp() {
  return (
    <div className="MainApp">
      <header className="MainApp-header">
        <h1>MainApp</h1>
        <p>{riot_api_key}</p>
      </header>
    </div>
  );
}

export default MainApp;
