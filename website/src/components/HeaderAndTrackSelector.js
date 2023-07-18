import React from "react";

import "/node_modules/flag-icons/css/flag-icons.min.css";

// A map of track names to flag icons
export const trackFlagMap = {
  SILVERSTONE: "gb",
  SPA: "be",
  SUZUKA: "jp",
  MONZA: "it",
  MONTREAL: "ca",
  MELBOURNE: "au",
  BAKU: "az",
  SINGAPORE: "sg",
  "ABU DHABI": "ae",
  AUSTIN: "us",
  INTERLAGOS: "br",
  MONACO: "mc",
  BAHRAIN: "bh",
  SOCHI: "ru",
  HUNGARORING: "hu",
  BARCELONA: "es",
  ZANDVOORT: "nl",
  JEDDAH: "sa",
  IMOLA: "it",
  "PAUL RICARD": "fr",
};

// A map of track names to track country
export const trackCountryMap = {
  SILVERSTONE: "UK",
  SPA: "BELGIUM",
  SUZUKA: "JAPAN",
  MONZA: "ITALY",
  MONTREAL: "CANADA",
  MELBOURNE: "AUSTRALIA",
  BAKU: "AZERBAIJAN",
  SINGAPORE: "SINGAPORE",
  "ABU DHABI": "UAE",
  AUSTIN: "US",
  INTERLAGOS: "BRAZIL",
  MONACO: "MONACO",
  BAHRAIN: "BAHRAIN",
  SOCHI: "RUSSIA",
  HUNGARORING: "HUNGARY",
  BARCELONA: "SPAIN",
  ZANDVOORT: "NETHERLANDS",
  JEDDAH: "SAUDI ARABIA",
  IMOLA: "ITALY",
  "PAUL RICARD": "FRANCE",
};

// A map of the colors in each track's flag
export const trackFlagColorMap = {
  SILVERSTONE: ["#012169", "#FFFFFF", "#CE1126"],
  SPA: ["#000000", "#FFD700", "#FF0000"],
  SUZUKA: ["#FFFFFF", "#DC143C"],
  MONZA: ["#009246", "#FFFFFF", "#DC0000"],
  MONTREAL: ["#FFFFFF", "#DC143C"],
  BAKU: ["#3F8AE0", "#ED2939"],
  SINGAPORE: ["#FFFFFF", "#DC143C"],
  INTERLAGOS: ["#009B3A", "#FEE12B", "#FFFFFF", "#009B3A"],
};

// A map of track name to track layout svg file name
export const trackLayoutMap = {
  SILVERSTONE: "greatbritain.svg",
  SPA: "belgium.svg",
  SUZUKA: "japan.svg",
  MONZA: "italy.svg",
  MONTREAL: "canada.svg",
  MELBOURNE: "australia.svg",
  BAKU: "azerbaijan.svg",
  SINGAPORE: "singapore.svg",
  "ABU DHABI": "abudhabi.svg",
  AUSTIN: "usa.svg",
  INTERLAGOS: "brazil.svg",
  MONACO: "monaco.svg",
  BAHRAIN: "bahrain.svg",
  SOCHI: "russia.svg",
  HUNGARORING: "hungary.svg",
  BARCELONA: "spain.svg",
  ZANDVOORT: "netherlands.svg",
  // "JEDDAH": "saudiarabia.svg",
  // "IMOLA": "italy.svg",
  "PAUL RICARD": "france.svg",
};

export function TrackSelector({ trackOptions, selectedTrack, onChange }) {
  return (
    <div className="track-selector" onClick={(e) => e.stopPropagation()}>
      <span>{trackCountryMap[selectedTrack]} </span>
      <span className={`fi fi-${trackFlagMap[selectedTrack]}`}></span>
      <span> {selectedTrack}</span>
      <select value={selectedTrack} onChange={onChange}>
        {trackOptions.map((track) => (
          <option key={track} value={track}>
            {track}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TrackSelector;
