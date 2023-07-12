// A table showing the fastest laps of each user in the database.
// The component is passed the data from the database as a prop, structured as
//     {{}}

import React from 'react';

// trackData:
// "SILVERSTONE": {
//   "BRAGE": {
//     "2023-07-11_14:30": {
//       "LAPTIME": "01:12:345",
//       "RACING_LINE": false
//     }
//   },
//   "NIKLAS": {
//     "2023-07-10_14:40": {
//       "LAPTIME": "01:32:345",
//       "RACING_LINE": true
//     }
//   },
//   "OLIVER": {
//     "2023-07-10_01:02:04": {
//       "LAPTIME": "01:35:699",
//       "RACING_LINE": true
//     }
//   }
// },

const Leaderboard = ({ trackData }) => {
  const latestLaptimes = [];

  Object.keys(trackData).forEach((driver) => {
    let latestTimestamp = null;
    let latestLaptime = null;

    Object.keys(trackData[driver]).forEach((timestamp) => {
      if (!latestTimestamp || timestamp > latestTimestamp) {
        latestTimestamp = timestamp;
        latestLaptime = trackData[driver][timestamp].LAPTIME;
      }
    });

    latestLaptimes.push({
      driver,
      laptime: latestLaptime,
      racingLine: trackData[driver][latestTimestamp].RACING_LINE,
    });
  });

  // Sort the latest laptimes by laptime
  latestLaptimes.sort((a, b) => {
    const aLaptime = a.laptime.split(":");
    const bLaptime = b.laptime.split(":");
    for (let i = 0; i < aLaptime.length; i++) {
      if (parseInt(aLaptime[i]) < parseInt(bLaptime[i])) {
        return -1;
      } else if (parseInt(aLaptime[i]) > parseInt(bLaptime[i])) {
        return 1;
      }
    }
    return 0;
  });

  // Add an index column to the latest laptimes
  const latestLaptimesWithIndex = latestLaptimes.map((laptime, index) => {
    return {
      ...laptime,
      index: index + 1,
    };
  });

    return (
      // Show latest laptimes
      <div>
        <table>
          <tbody>
            {latestLaptimesWithIndex.map(({ index, driver, laptime, racingLine }) => (
              <tr key={driver}>
                <td>{index}.</td>
                <td>{driver}</td>
                <td>{laptime}</td>
                <td>{racingLine ? <span style={{color: 'red'}}>RL</span> : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default Leaderboard;

