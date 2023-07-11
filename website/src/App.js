import './App.css';
import logo from './bragis.jpg';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                process.env.REACT_APP_TEST_VARIABLE: {process.env.REACT_APP_PRIVATE_KEY}
            </header>
        </div>
    );
}

export default App;
