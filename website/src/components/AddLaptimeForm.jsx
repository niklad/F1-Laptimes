import React, { useState } from "react";
import Swal from "sweetalert2";
import "../styles/AddLaptimeForm.css";
import { findAndSortLaptimes } from "./Leaderboard";

function formatLaptime(laptime) {
    // Make a function to format a laptime, so that it is always in the format m:ss:SSS
    // Example: 1:2.3 -> 01:02:300

    laptime = laptime.replace(/\./g, ":");

    // Split the laptime into minutes, seconds and milliseconds
    const laptimeSplit = laptime.split(":");
    let minutes = laptimeSplit[0];
    let seconds = laptimeSplit[1];
    let milliseconds = laptimeSplit[2];

    if (seconds.length === 1) {
        seconds = "0" + seconds;
    }
    if (milliseconds.length === 1) {
        milliseconds = "00" + milliseconds;
    } else if (milliseconds.length === 2) {
        milliseconds = "0" + milliseconds;
    }

    return minutes + ":" + seconds + "." + milliseconds;
}

function formatDiffTime(diffTime, trackData) {
    // Make a function to format a time difference, so that it is always in the format ss.SSS
    // Example: +1.226 -> +01.226
    console.log("trackData formatDiffTime", trackData);

    diffTime = diffTime.replace(/\:/g, ".");

    // Split the diffTime into seconds and milliseconds, split on the "+" sign and the period
    const diffTimeSplit = diffTime.split(/[+.]/);
    let diffTimeSeconds = diffTimeSplit[1];
    let diffTimeMilliseconds = diffTimeSplit[2];

    // Add the diffTime to the fastest laptime in trackData
    trackData = findAndSortLaptimes(trackData);

    // Set the fastest laptime as the first time of the first driver, structured as driver->timestamp->latime
    const fastestLaptime = trackData[0].laptime;

    // Split the fastest laptime into minutes, seconds and milliseconds
    const fastestLaptimeSplit = fastestLaptime.split(/[.:]/);
    let fastestLaptimeMinutes = fastestLaptimeSplit[0];
    let fastestLaptimeSeconds = fastestLaptimeSplit[1];
    let fastestLaptimeMilliseconds = fastestLaptimeSplit[2];

    let newLaptime;
    let newLaptimeMinutes = parseInt(fastestLaptimeMinutes);
    let newLaptimeSeconds =
        parseInt(fastestLaptimeSeconds) + parseInt(diffTimeSeconds);
    let newLaptimeMilliseconds =
        parseInt(fastestLaptimeMilliseconds) + parseInt(diffTimeMilliseconds);

    if (newLaptimeMilliseconds >= 1000) {
        newLaptimeSeconds += 1;
        newLaptimeMilliseconds -= 1000;
    }
    if (newLaptimeSeconds >= 60) {
        newLaptimeMinutes += 1;
        newLaptimeSeconds -= 60;
    }

    newLaptime =
        newLaptimeMinutes +
        ":" +
        newLaptimeSeconds +
        "." +
        newLaptimeMilliseconds;

    return formatLaptime(newLaptime);
}

const AddLaptimeForm = ({ track, trackData, onSubmit }) => {
    const [driverName, setDriverName] = useState("");
    const [laptime, setLaptime] = useState("");
    const [racingLineUsed, setRacingLineUsed] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        let formattedLaptime;
        const nameRegex = /^[a-zA-Z]{3}$/;
        const laptimeRegex = /^[0-9]{1,2}[:.][0-9]{1,2}[:.][0-9]{1,3}$/;
        // Regex to check if the entered time is on the format "+ss.SSS" or "+s.SSS"
        const diffTimeRegex = /^[+][0-9]{1,2}[:.][0-9]{1,3}$/;
        if (
            nameRegex.test(driverName) &&
            laptimeRegex.test(laptime) &&
            laptime.length === 8
        ) {
            formattedLaptime = formatLaptime(laptime);
        } else if (
            nameRegex.test(driverName) &&
            diffTimeRegex.test(laptime) &&
            laptime.length >= 6
        ) {
            formattedLaptime = formatDiffTime(laptime, trackData);
        } else {
            Swal.fire({
                icon: "warning",
                title: "heck no",
                text: "Please enter a valid driver name and laptime.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            return;
        }

        onSubmit(
            track,
            driverName.toUpperCase(),
            formattedLaptime,
            racingLineUsed
        );
        setDriverName("");
        setLaptime("");
        setRacingLineUsed(false);
    };

    return (
        <form onSubmit={handleSubmit} className="addLaptimeForm">
            <label>
                Driver:
                <input
                    className="driverName"
                    type="text"
                    name="driverName"
                    placeholder="ALO"
                    value={driverName}
                    onChange={(event) => setDriverName(event.target.value)}
                />
            </label>
            <br />
            <label>
                Laptime:
                <input
                    type="text"
                    name="laptime"
                    placeholder="m:ss.SSS"
                    value={laptime}
                    onChange={(event) => setLaptime(event.target.value)}
                />
            </label>
            <br />
            <label>
                Racing Line:
                <br />
                <input
                    type="checkbox"
                    name="racingLineUsed"
                    checked={racingLineUsed}
                    onChange={(event) =>
                        setRacingLineUsed(event.target.checked)
                    }
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddLaptimeForm;
