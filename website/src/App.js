import './App.css';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, get } from "firebase/database";

import { useState, useEffect } from 'react';

import Leaderboard from './components/Leaderboard';
import TrackSelector from './components/HeaderAndTrackSelector';
import AddLaptimeForm from './components/AddTimeButton';

import './styles/HeaderAndTrackSelector.css';
import './styles/Buttons.css';

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
    const [displayMode, setDisplayMode] = useState("leaderboard"); // "leaderboard", "addTime" or "statistics"

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

    const handleAddLaptime = (track, driverName, laptime, racingLineUsed) => {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");
        update(ref(db, `${track}/${driverName}/${timestamp}`), {
            LAPTIME: laptime,
            RACING_LINE: racingLineUsed,
        }).then(() => {
            return get(ref(db, track));
        }).then((snapshot) => {
            setTrackData(snapshot.val());
            setTrack(track);
            setDisplayMode("leaderboard");
        }).catch((error) => {
            console.error(error);
        });
    };


    const renderContent = () => {
    switch (displayMode) {
        case "leaderboard":
            return trackData && <Leaderboard trackData={trackData} />;
        case "addTime":
            return <AddLaptimeForm track={track} onSubmit={handleAddLaptime} />;
        case "statistics":
            return <div>Statistics Graph</div>;
        default:
        return null;
    }
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
                {renderContent()}
                <button onClick={() => setDisplayMode(displayMode === "addTime" ? "leaderboard" : "addTime")}>
                {displayMode === "addTime" ? "Show Leaderboard" : "Add Laptime"}
                </button>
                <button onClick={() => setDisplayMode(displayMode === "statistics" ? "leaderboard" : "statistics")}>
                {displayMode === "statistics" ? "Show Leaderboard" : "Statistics"}
                </button>
            </header>
        </div>
    );
}

export default App;
