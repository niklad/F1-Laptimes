import './App.css';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

import { useState } from 'react';
import { useEffect } from 'react';

import Leaderboard from './components/TrackContainer';
import TrackSelector from './components/TrackContainer/HeaderAndTrackSelector';

import './styles/HeaderAndTrackSelector.css';

// import TrackContainer from './components/TrackContainer';

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


function App() {
    const [track, setTrack] = useState("SPA");
    const [trackData, setTrackData] = useState(null);

    // Define the track options for the dropdown menu
    const trackOptions = ["SPA", "SILVERSTONE"];

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Set the trackData to be the data in the database at the key of the track name, e.g. "SPA".
    useEffect(() => {
        const trackRef = ref(db, track);
        onValue(trackRef, (snapshot) => {
            const data = snapshot.val();
            setTrackData(data);
        });
    }, [track]);

    // Define a function to handle changes to the selected track
    const handleTrackChange = (event) => {
        setTrack(event.target.value);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    <TrackSelector
                        trackOptions={trackOptions}
                        selectedTrack={track}
                        onChange={handleTrackChange}
                    />
                </h1>
                {trackData && <Leaderboard trackData={trackData} />}
            </header>
        </div>
    );
}

export default App;
