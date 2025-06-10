import logo from './logo.svg';
import './App.css';
import ExcelUploadButton from './Components/ExcelUploadButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Excel Upload</h1>
        <div>
          <ExcelUploadButton />
          <p>
            Upload your Excel file to manage your inventory efficiently.
          </p>
        </div>

      </header>
    </div>
  );
}

export default App;
