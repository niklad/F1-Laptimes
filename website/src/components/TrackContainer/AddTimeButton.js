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





const AddLaptimeForm = ({ track, onSubmit }) => {
  const [driverName, setDriverName] = useState("");
  const [laptime, setLaptime] = useState("");
  const [racingLineUsed, setRacingLineUsed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(track, driverName, laptime, racingLineUsed);
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
