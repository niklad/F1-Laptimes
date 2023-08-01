import "./App.css";
import "./styles/HeaderAndTrackSelector.css";
import "./styles/Buttons.css";
import "./styles/Leaderboard.css";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, get } from "firebase/database";

import { useState, useEffect } from "react";

import Leaderboard from "./components/Leaderboard";
import {
  TrackSelector,
  trackLayoutMap,
} from "./components/HeaderAndTrackSelector";
import AddLaptimeForm from "./components/AddLaptimeForm";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

function App() {
  const [track, setTrack] = useState("SPA");
  const [trackData, setTrackData] = useState(null);
  const [displayMode, setDisplayMode] = useState("leaderboard"); // "leaderboard", "addTime" or "statistics"
  const [showLaptimeDifference, setShowLaptimeDifference] = useState(true);

  // Define the track options for the dropdown menu
  const trackOptions = [
    "DRIVER STANDINGS",
    "SPA",
    "RED BULL RING",
    "SUZUKA",
    "INTERLAGOS",
    "ZANDVOORT",
    "MONACO",
    "SILVERSTONE",
    "BAKU",
    "MONZA",
    "AUSTIN",
    "BARCELONA",
    "BAHRAIN",
    "MONTREAL",
    "MELBOURNE",
    "SINGAPORE",
    "HUNGARORING",
    "PAUL RICARD",
    "SOCHI",
    "ABU DHABI",
    "IMOLA",
    "JEDDAH",
  ];

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
    })
      .then(() => {
        return get(ref(db, track));
      })
      .then((snapshot) => {
        setTrackData(snapshot.val());
        setTrack(track);
        setDisplayMode("leaderboard");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderContent = () => {
    switch (displayMode) {
      case "leaderboard":
        return (
          trackData && (
            <Leaderboard
              trackData={trackData}
              showLaptimeDifference={showLaptimeDifference}
            />
          )
        );
      case "addTime":
        return <AddLaptimeForm track={track} onSubmit={handleAddLaptime} />;
      case "statistics":
        return (
          <div>
            Statistics Graph <br /> Coming Soon
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="Background" />
      <div className="Content">
        <img
          src={"trackLayouts/" + trackLayoutMap[track]}
          alt=""
          className="Track-layout"
        />
        <TrackSelector
          trackOptions={trackOptions}
          selectedTrack={track}
          onChange={handleTrackChange}
        />
        <div className="Rendered-content">{renderContent()}</div>
        <div className="Buttons">
          {displayMode === "leaderboard" ? (
            <button
              className="timeDiffs"
              onClick={() => setShowLaptimeDifference(!showLaptimeDifference)}
            >
              {showLaptimeDifference ? "Show Interval" : "Show Gap to Leader"}
            </button>
          ) : null}
          <button
            onClick={() =>
              setDisplayMode(
                displayMode === "addTime" ? "leaderboard" : "addTime"
              )
            }
          >
            {displayMode === "addTime" ? "Back to Leaderboard" : "Add Laptime"}
          </button>
          <button
            onClick={() =>
              setDisplayMode(
                displayMode === "statistics" ? "leaderboard" : "statistics"
              )
            }
          >
            {displayMode === "statistics"
              ? "Back to Leaderboard"
              : "Show Statistics"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
