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
import NoTrackData from "./components/NoTrackData";
import F1GameSelector from "./components/F1GameSelector";

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
    "ZANDVOORT",
    "IMOLA",
    "MONACO",
    "SUZUKA",
    "INTERLAGOS",
    "MONZA",
    "SILVERSTONE",
    "BAKU",
    "AUSTIN",
    "BAHRAIN",
    "BARCELONA",
    "MONTREAL",
    "SINGAPORE",
    "HUNGARORING",
    "MELBOURNE",
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

    const [f1Game, setf1Game] = useState(() => {
        const storedf1Game = localStorage.getItem("f1Game");
        return storedf1Game !== null ? storedf1Game : "F1 2023";
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

    useEffect(() => {
        localStorage.setItem("f1Game", f1Game);
    }, [f1Game]);

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // get the database at the game given by f1Game
    const database = getDatabase(app);

    // Set the trackData to be the data in the database at the key of the track name, e.g. "SPA".
    useEffect(() => {
        const trackRef = ref(database, `${f1Game}/${track}`);
        onValue(trackRef, (snapshot) => {
            const data = snapshot.val();
            setTrackData(data);
        });
    }, [database, f1Game, track]);

    // Define a function to handle changes to the selected track
    const handleTrackChange = (event) => {
        setTrack(event);
    };

    const handleAddLaptime = handleAddLaptimeFunction(
        database,
        setTrackData,
        setTrack,
        setDisplayMode,
        f1Game
    );

    const renderContent = renderContentFunction(
        track,
        database,
        displayMode,
        trackData,
        showLaptimeDifference,
        handleAddLaptime,
        f1Game
    );

    useArrowsForNavigation(track, setTrack);

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
                <F1GameSelector f1Game={f1Game} setf1Game={setf1Game} />
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

function useArrowsForNavigation(track, setTrack) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            let currentIndex;
            let newIndex;
            if (document.activeElement.tagName === "INPUT") {
                return;
            }
            switch (event.key) {
                case "ArrowUp":
                    currentIndex = trackOptions.indexOf(track);
                    newIndex =
                        currentIndex === 0
                            ? trackOptions.length - 1
                            : currentIndex - 1;
                    setTrack(trackOptions[newIndex]);
                    break;
                case "ArrowLeft":
                    currentIndex = trackOptions.indexOf(track);
                    newIndex =
                        currentIndex === 0
                            ? trackOptions.length - 1
                            : currentIndex - 1;
                    setTrack(trackOptions[newIndex]);
                    break;
                case "ArrowDown":
                    currentIndex = trackOptions.indexOf(track);
                    newIndex =
                        currentIndex === trackOptions.length - 1
                            ? 0
                            : currentIndex + 1;
                    setTrack(trackOptions[newIndex]);
                    break;
                case "ArrowRight":
                    currentIndex = trackOptions.indexOf(track);
                    newIndex =
                        currentIndex === trackOptions.length - 1
                            ? 0
                            : currentIndex + 1;
                    setTrack(trackOptions[newIndex]);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setTrack, track]);
}

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

function handleAddLaptimeFunction(
    database,
    setTrackData,
    setTrack,
    setDisplayMode,
    f1Game
) {
    return (track, driverName, laptime, racingLineUsed) => {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");
        update(ref(database, `${f1Game}/${track}/${driverName}/${timestamp}`), {
            LAPTIME: laptime,
            RACING_LINE: racingLineUsed,
        })
            .then(() => {
                return get(ref(database, `${f1Game}/${track}`));
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
    database,
    displayMode,
    trackData,
    showLaptimeDifference,
    handleAddLaptime,
    f1Game
) {
    return (trackOptions) => {
        if (track === "DRIVER STANDINGS") {
            return (
                <CombinedLeaderboard
                    database={database}
                    trackOptions={trackOptions}
                    f1Game={f1Game}
                />
            );
        }
        switch (displayMode) {
            case "leaderboard":
                if (!trackData) {
                    return <NoTrackData />;
                }
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
                if (!trackData) {
                    return <NoTrackData />;
                }
                return <Statistics track={track} trackData={trackData} />;
            default:
                return null;
        }
    };
}
