import React, { useState } from "react";


// /**
//  * Register a new laptime.
//  * @constructor
//  * @param {string} track - Name of track.
//  * @param {string} user - Name of user.
//  * @param {string} timestamp - Date and time of input. Format: yyyy-dd-mm_hh-mm-ss (date_time)
//  * @param {Boolean} racingline - Bool varaible indicating the use of the racing line
//  * Example of use: registerLaptime('SPA', 'EIRIK', '2023-07-10_01:02:04', '01:35:699', true);
//  */

// function registerLaptime(track, user, timestamp, laptime, racingline) {
//     const db = getDatabase();
//     update(ref(db, track + '/' + user + '/' + timestamp), {
//             'LAPTIME': laptime,
//             'RACING_LINE': racingline
//         }
//     );
// }


function formatLaptime(laptime) {
    // Make a function to format a laptime, so that it is always in the format m:ss:SSS
    // Example: 1:2.3 -> 01:02:300

    laptime = laptime.replace(".", ":");

    // Split the laptime into minutes, seconds and milliseconds
    const laptimeSplit = laptime.split(":");
    let minutes = laptimeSplit[0];
    let seconds = laptimeSplit[1];
    let milliseconds = laptimeSplit[2];

    // Remove leading zeros
    if (minutes[0] === "0") {
        minutes = minutes.substring(1);
    }

    // Return the formatted laptime

    return minutes + ":" + seconds + ":" + milliseconds;
}



const AddLaptimeForm = ({ track, onSubmit }) => {
    const [driverName, setDriverName] = useState("");
    const [laptime, setLaptime] = useState("");
    const [racingLineUsed, setRacingLineUsed] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (driverName === "" || laptime === "") {
            alert("Please enter a driver name and laptime.");
            return;
        }
        const formattedLaptime = formatLaptime(laptime);
        onSubmit(track, driverName.toUpperCase(), formattedLaptime, racingLineUsed);
        setDriverName("");
        setLaptime("");
        setRacingLineUsed(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Driver:
                <input
                    type="text"
                    name="driverName"
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
                    value={laptime}
                    onChange={(event) => setLaptime(event.target.value)}
                />
            </label>
            <br />
            <label>
                Racing Line:
                <input
                    type="checkbox"
                    name="racingLineUsed"
                    checked={racingLineUsed}
                    onChange={(event) => setRacingLineUsed(event.target.checked)}
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddLaptimeForm;
