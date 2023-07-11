import './App.css';
import logo from './bragis.jpg';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, update, ref, set } from "firebase/database";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * Register a new laptime.
 * @constructor
 * @param {string} track - Name of track.
 * @param {string} user - Name of user.
 * @param {string} timestamp - Date and time of input. Format: yyyy-dd-mm_hh-mm-ss (date_time)
 * @param {Boolean} racingline - Bool varaible indicating the use of the racing line
 * Example of use: registerLaptime('SPA', 'EIRIK', '2023-07-10_01:02:04', '01:35:699', true);
 */
function registerLaptime(track, user, timestamp, laptime, racingline) {
    const db = getDatabase();
    update(ref(db, track + '/' + user + '/' + timestamp), { 
            'LAPTIME': laptime,
            'RACING_LINE': racingline
        }
    );
}

function App() {

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    <br />
                    <br />
                    Hei.
                </p>
                process.env.REACT_APP_TEST_VARIABLE: {process.env.REACT_APP_PRIVATE_KEY}
            </header>
        </div>
    );
}

export default App;
