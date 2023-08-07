import "./App.css";
import "./styles/HeaderAndTrackSelector.css";
import "./styles/Buttons.css";
import "./styles/Leaderboard.css";
import "./styles/Statistics.css";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, get } from "firebase/database";

import { useState, useEffect } from "react";

import Leaderboard from "./components/Leaderboard";
import {
    TrackSelector,
    trackLayoutMap,
} from "./components/HeaderAndTrackSelector";
import AddLaptimeForm from "./components/AddLaptimeForm";
import CombinedLeaderboard from "./components/CombinedLeaderboard";
import Statistics from "./components/Statistics";

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

// Define the track options for the dropdown menu
const trackOptions = [
    "DRIVER STANDINGS",
    "SPA",
    "RED BULL RING",
    "SUZUKA",
    "INTERLAGOS",
    "ZANDVOORT",
    "MONACO",
    "IMOLA",
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
    "JEDDAH",
];

function App() {
    const [track, setTrack] = useState(() => {
        const storedTrack = localStorage.getItem("track");
        return storedTrack !== null ? storedTrack : "DRIVER STANDINGS";
    });

    const [trackData, setTrackData] = useState(() => {
        const storedTrackData = localStorage.getItem("trackData");
        return storedTrackData !== null ? JSON.parse(storedTrackData) : null;
    });

    const [displayMode, setDisplayMode] = useState(() => {
        const storedDisplayMode = localStorage.getItem("displayMode");
        return storedDisplayMode !== null ? storedDisplayMode : "leaderboard";
    });

    const [showLaptimeDifference, setShowLaptimeDifference] = useState(() => {
        const storedShowLaptimeDifference = localStorage.getItem(
            "showLaptimeDifference"
        );
        return storedShowLaptimeDifference !== null
            ? JSON.parse(storedShowLaptimeDifference)
            : true;
    });

    useEffect(() => {
        localStorage.setItem("track", track);
    }, [track]);

    useEffect(() => {
        localStorage.setItem("trackData", JSON.stringify(trackData));
    }, [trackData]);

    useEffect(() => {
        localStorage.setItem("displayMode", displayMode);
    }, [displayMode]);

    useEffect(() => {
        localStorage.setItem(
            "showLaptimeDifference",
            JSON.stringify(showLaptimeDifference)
        );
    }, [showLaptimeDifference]);

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
    }, [db, track]);

    // Define a function to handle changes to the selected track
    const handleTrackChange = (event) => {
        setTrack(event);
    };

    const handleAddLaptime = handleAddLaptimeFunction(
        db,
        setTrackData,
        setTrack,
        setDisplayMode
    );

    const renderContent = renderContentFunction(
        track,
        db,
        displayMode,
        trackData,
        showLaptimeDifference,
        handleAddLaptime
    );

    return (
        <div className="App">
            <div className="Background" />
            <div className="Content">
                {track === "DRIVER STANDINGS" ||
                track === "IMOLA" ||
                displayMode === "statistics" ? null : (
                    <img
                        src={"trackLayouts/" + trackLayoutMap[track]}
                        alt="track layout"
                        className="Track-layout"
                    />
                )}
                <TrackSelector
                    trackOptions={trackOptions}
                    selectedTrack={track}
                    onChange={handleTrackChange}
                />
                <div className="Rendered-content">
                    {renderContent(trackOptions)}
                </div>
                {renderButtonSection(
                    displayMode,
                    track,
                    setShowLaptimeDifference,
                    showLaptimeDifference,
                    setDisplayMode
                )}
            </div>
        </div>
    );
}

export default App;

function renderButtonSection(
    displayMode,
    track,
    setShowLaptimeDifference,
    showLaptimeDifference,
    setDisplayMode
) {
    return (
        <div className="Buttons">
            {track === "DRIVER STANDINGS" ? null : (
                <button
                    onClick={() =>
                        setDisplayMode(
                            displayMode === "addTime"
                                ? "leaderboard"
                                : "addTime"
                        )
                    }
                >
                    {displayMode === "addTime" ? (
                        <img
                            className="button-icon"
                            src="button-icons/leaderboard-icon.svg"
                            alt="leaderboard icon"
                        />
                    ) : (
                        <img
                            className="button-icon"
                            src="button-icons/add-time-icon.svg"
                            alt="add laptime icon"
                        ></img>
                    )}
                </button>
            )}
            {displayMode === "leaderboard" && track !== "DRIVER STANDINGS" ? (
                <button
                    className="timeDiffs"
                    onClick={() =>
                        setShowLaptimeDifference(!showLaptimeDifference)
                    }
                >
                    {showLaptimeDifference ? (
                        <img
                            className="timeDiffs-icon"
                            src="button-icons/clockwise-icon.svg"
                            alt="time interval icon"
                        />
                    ) : (
                        <img
                            className="timeDiffs-icon"
                            src="button-icons/first-time-icon.svg"
                            alt="time gap icon"
                        />
                    )}
                </button>
            ) : null}
            {track === "DRIVER STANDINGS" ? null : (
                <button
                    onClick={() =>
                        setDisplayMode(
                            displayMode === "statistics"
                                ? "leaderboard"
                                : "statistics"
                        )
                    }
                >
                    {displayMode === "statistics" ? (
                        <img
                            className="button-icon"
                            src="button-icons/leaderboard-icon.svg"
                            alt="leaderboard icon"
                        />
                    ) : (
                        <img
                            className="button-icon"
                            src="button-icons/market-research-icon.svg"
                            alt="statistics icon"
                        />
                    )}
                </button>
            )}
        </div>
    );
}

function handleAddLaptimeFunction(db, setTrackData, setTrack, setDisplayMode) {
    return (track, driverName, laptime, racingLineUsed) => {
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
}

function renderContentFunction(
    track,
    db,
    displayMode,
    trackData,
    showLaptimeDifference,
    handleAddLaptime
) {
    return (trackOptions) => {
        if (track === "DRIVER STANDINGS") {
            return (
                <CombinedLeaderboard
                    database={db}
                    trackOptions={trackOptions}
                />
            );
        }
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
                return (
                    <AddLaptimeForm
                        track={track}
                        trackData={trackData}
                        onSubmit={handleAddLaptime}
                    />
                );
            case "statistics":
                return <Statistics track={track} trackData={trackData} />;
            default:
                return null;
        }
    };
}
