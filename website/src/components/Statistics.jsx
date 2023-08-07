import React, { useRef, useState, useEffect } from "react";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const Statistics = ({ track, trackData }) => {
  const lineChartRef = useRef(null);
  const [hiddenLines, setHiddenLines] = useState([]);
  const [driverColorsState, setDriverColorsState] = useState({});

  const [originalData, setOriginalData] = useState([]);
  const [presentableData, setPresentableData] = useState([]);

  // Empty the hiddenLines list when trackData changes
  useEffect(() => {
    setHiddenLines([]);

    if (trackData !== null) {

      const [allLaptimes, timestamps] = findLaptimes(trackData);

      const data = createData(allLaptimes, timestamps);
      setPresentableData(data.slice());
      setOriginalData(data.slice());
    }
    
  }, [track, trackData]);

  // Checking if there are any drivers with laptimes for selected track
  if (trackData == null) {
    return (
      <div>
        NO DATA
      </div>
    );
  }

  const [allLaptimes, timestamps] = findLaptimes(trackData);

  const data = createData(allLaptimes, timestamps);
  const keys = Object.keys(data[0]);

  // console.log(originalData)

  const CustomLegend = ({ payload, onClick }) => {
    return (
      <ul className="custom-legend" style={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{ listStyleType: 'none', marginRight: 20, cursor: 'pointer' }}
            onClick={(e) => onClick(e, entry)}
          >
            <span style={{ color: entry.color }}>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  const handleLegendClick = (e, entry) => {
    const { value } = entry;
    
    setHiddenLines((prevHiddenLines) =>
      prevHiddenLines.includes(value)
        ? prevHiddenLines.filter((name) => name !== value)
        : [...prevHiddenLines, value]
    );

    setPresentableData(originalData);
    // console.log(originalData)
    // const placeHolderData = originalData;
    // console.log(placeHolderData)
    const [allLaptimes, timestamps] = findLaptimes(trackData);

    const data2 = createData(allLaptimes, timestamps);
    console.log(data2)
    setPresentableData(data2)

    // console.log(hiddenLines);
    for (const dict of data2) {
      Object.keys(dict).forEach((key) => {

        if (!Number.isFinite(dict[key]) || !hiddenLines.includes(key) && key === value) {
          delete dict[key]
        };
      });
    }

    let indexesToRemove = [];
    for (let i = 0; i < data2.length; i++) {
      if (Object.keys(data2[i]).length < 1) {
        indexesToRemove.push(i);
      }
    }

    // Remove the items with the indexesToRemove from presentableData
    const filteredData = data2.filter((_, index) => !indexesToRemove.includes(index));
    setPresentableData(filteredData);

    // presentableData.filter((element, index) => !indexesToRemove.includes(index));

    // presentableData.filter((dict) => Object.keys(dict).length === 0);
    // presentableData.shift();
    // console.log(presentableData)

  };

  const renderLineChart = (
    <ResponsiveContainer width="90%" height="90%">
        <LineChart ref={lineChartRef} data={presentableData}>
          <Tooltip
            label="Times" // Customize the tooltip header
            formatter={(value, name) => {
              const minutes = Math.floor(value / 60);
              const seconds = (value % 60).toFixed(3).padStart(6, "0");
              return `${minutes.toString().padStart(2, "0")}:${seconds}`;
            }}
            cursor={false}
          />
          <Legend onClick={handleLegendClick} content={CustomLegend}/>
          <CartesianGrid vertical={false} strokeOpacity={0.7}/>

          <XAxis
            // domain={['auto', 'auto']}
            // type="number"
            // domain={[1, 5]}
            // type="number"
            // domain={[0, 10]}
            dataKey="name"
            // display="none"
            height={0}
          />

          <YAxis
            // domain={['dataMin', 'dataMax']} // Use custom domain to show laptime range
            domain={['auto', 'auto']}
            
            tickFormatter={(value) => {
              const minutes = Math.floor(value / 60);
              const seconds = (value % 60).toFixed(3).padStart(6, "0");
              return `${minutes.toString().padStart(2, "0")}:${seconds}`;
            }}
            // axisLine={false} // Hide Y-axis line
            tickLine={false} // Hide Y-axis tick lines
            // tick={false}
            // axisLine={{ stroke: "white" }}
            axisLine={false}
            tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: "0.7em" }}
            width={120}
            // width="20%"
          />

          {keys.map((key, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={key}
              stroke={getRandomColor(key, driverColorsState)}
              dot={shouldUseDot(key, data)}
              connectNulls
              activeDot={{ r: 0 }}
              strokeWidth={3}
              hide={shouldBeHidden(key, hiddenLines)}
              data-legend-name={key}
            />
          ))}
        </LineChart>

    </ResponsiveContainer>
  );

  return (
    <div className="Stat-div">
        {renderLineChart}
    </div>
  );
};

function findLaptimes(trackData) {
  const allLaptimes = {}; // Object to store all laptimes for each user
  const timestamps = [];
  const drivers = [];

  // Add the last laptime of each driver to match the maximum number of laptimes
  Object.keys(trackData).forEach((driver) => {
    const laptimes = [];
    drivers.push(driver);
    
    Object.keys(trackData[driver]).forEach((timestamp) => {
      const laptimeData = trackData[driver][timestamp];
      const laptime = laptimeData.LAPTIME;
      const laptimeFloat = parseLaptimeToFloat(laptimeData.LAPTIME);
      const racingLine = laptimeData.RACING_LINE;

      timestamps.push(timestamp)

      // Assuming laptime is a number and not null or undefined
      laptimes.push({ timestamp, laptime, laptimeFloat, racingLine });
    });

    allLaptimes[driver] = laptimes;
  });

  // Sort timestamps in ascending order
  timestamps.sort();
  
  return [allLaptimes, timestamps];
}

function parseLaptimeToFloat(laptimeString) {
  const [minutes, secondsMilliseconds] = laptimeString.split(":");
  const [seconds, milliseconds] = secondsMilliseconds.split(".");
  const totalSeconds = parseFloat(minutes) * 60 + parseFloat(seconds) + parseFloat(`0.${milliseconds}`);
  return totalSeconds;
}

function createData(allLaptimes, timestamps) {
  const data = [];
  const drivers = [];

  for (let i = 0; i < timestamps.length; i++) {
    // Check if the dictionary exists at the specified index in the data array
    if (!data[i]) {
      data[i] = {}; // Create an empty dictionary if it doesn't exist
    }
  }
  

  // Iterate through the drivers in the allLaptimes dictionary
  Object.keys(allLaptimes).forEach((driver) => {
    drivers.push(driver);
    // Access the laptimes of the current driver
    const driverLaptimes = allLaptimes[driver];

    // Iterate through the laptimes of the current driver
    driverLaptimes.forEach((laptimeObj, index) => {
      // Extract the laptimeFloat value from the laptimeObj
      const laptimeFloat = laptimeObj.laptimeFloat;

      const index_ = timestamps.indexOf(laptimeObj.timestamp);
      data[index_][driver] = laptimeFloat;
    });
  });

  for (let i = 0; i < drivers.length; i++) {
    let previousLaptime;  

    for (let j = 0; j < data.length; j++) {
      if (!data[j][drivers[i]]) {
        data[j][drivers[i]] = previousLaptime;
      } else {
        previousLaptime = data[j][drivers[i]];
      }

      if (j === data.length - 1) {
        data[j][drivers[i]] = previousLaptime;
      }
    }
  }
  // presentableData = data;
  // console.log(presentableData);
  return data;
}

const getRandomColor = (driver, driverColorsState) => {

  const driverColors = {
    'STR': "#358C75", // AM
    'SAM': "#3671C6", // RED BULL
    'RUN' : "#6CD3BF", // Mercedes
    'GRA' : '#B6BABD', // HAAS
  }

  const colors = [
    '#F91536', // Ferarri
    '#F58020', // Mclaren
    '#2293D1', // Alpine
    '#5E8FAA', // AT
    '#37BEDD', // Williams
    '#C92D4B', // AR
  ];

  if (driverColors[driver]) {
    return driverColors[driver];
  } else if (driverColorsState[driver]) {
    return driverColorsState[driver];
  }

  const takenColors = Object.values(driverColorsState);
  const availableColors = colors.filter(color => !takenColors.includes(color));

  // If no available colors - use purple
  if (availableColors.length < 1) {
    return '#702963';
  }

  const randomIndex = Math.floor(Math.random() * availableColors.length);
  driverColorsState[driver] = availableColors[randomIndex];
  return availableColors[randomIndex];
};

function shouldUseDot(driver, data) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if(typeof data[i][driver] !== 'undefined') {
      count++;
    }
  }
  return count === 1;
}

function shouldBeHidden(key, hiddenLines) {
  return hiddenLines.includes(key)
}

export default Statistics;
