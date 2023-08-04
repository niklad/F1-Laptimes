import React, { useState } from "react";
import Swal from "sweetalert2";
import "../styles/AddLaptimeForm.css";

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

const AddLaptimeForm = ({ track, onSubmit }) => {
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
            laptime.length == 8
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
