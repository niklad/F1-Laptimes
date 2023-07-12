import React from 'react';

import '../styles/Leaderboard.css';


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
      <div>
        <table className="leaderboard-table">
          <tbody>
            {latestLaptimesWithIndex.map(({ index, driver, laptime, racingLine }) => (
              <tr key={driver}>
                <td>{index}.</td>
                <td>{driver}</td>
                <td>{laptime}</td>
                <td>{racingLine ? <span style={{fontWeight: 'bold'}}>RL</span> : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default Leaderboard;

