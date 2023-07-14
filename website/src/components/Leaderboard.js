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

  console.log(latestLaptimes)
  // return "No laptimes set" if latestLaptimes are nothing
  if (latestLaptimes.length === 0) {
    return <div>No laptimes set</div>;
  }

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
          {latestLaptimesWithIndex.map(({ index, driver, laptime, racingLine }, laptimeIndex) => (
            <tr key={driver}>
              <td>{index}.</td>
              <td>{driver}</td>
              <td>{laptime}</td>
              {laptimeIndex > 0 ? (
                <td style={{ color: 'yellow' }}> {calculateTimeDifference(laptime, latestLaptimesWithIndex[0].laptime)}</td>
              ) : (
                <td></td>
              )}
              <td>{racingLine ? <span style={{fontWeight: 'bold'}}>RL</span> : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

// Function to calculate the time difference between two lap times
const calculateTimeDifference = (laptime, quickestLaptime) => {
  // Convert laptime strings to arrays of time components
  const laptimeArray = laptime.split(":").map(Number);
  const quickestLaptimeArray = quickestLaptime.split(":").map(Number);

  // Calculate the time difference in milliseconds
  const laptimeMilliseconds = laptimeArray[0] * 60000 + laptimeArray[1] * 1000 + laptimeArray[2];
  const quickestLaptimeMilliseconds = quickestLaptimeArray[0] * 60000 + quickestLaptimeArray[1] * 1000 + quickestLaptimeArray[2];
  const differenceMilliseconds = laptimeMilliseconds - quickestLaptimeMilliseconds;

  // Format the time difference as a string
  const minutes = Math.floor(differenceMilliseconds / 60000);
  const seconds = Math.floor((differenceMilliseconds % 60000) / 1000);
  const milliseconds = differenceMilliseconds % 1000;

  if (minutes > 0) {
    const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
    return <span style={{ color: 'yellow' }}>+ {totalSeconds.toFixed(3)}</span>;
  } else {
    return <span style={{ color: 'yellow' }}>+ {seconds}.{milliseconds.toString().padStart(3, '0')}</span>;
  }
};
