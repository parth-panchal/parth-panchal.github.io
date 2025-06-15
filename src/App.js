import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import Blobity from 'blobity';

function App() {
  useEffect(() => {
    const blobity = new Blobity();
    
    return () => {
      blobity.destroy();
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          data-blobity-magnetic="false"
        >
          Learn React
        </a>
        <button 
          className="blobity-button"
          data-blobity-magnetic="false"
          style={{
            margin: '20px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#61dafb',
            color: '#282c34',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Try Blobity Cursor!
        </button>
      </header>
    </div>
  );
}

export default App;
