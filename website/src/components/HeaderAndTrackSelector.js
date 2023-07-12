import React from 'react';

import "/node_modules/flag-icons/css/flag-icons.min.css";


// A map of track names to flag icons
const trackFlagMap = {
    "SILVERSTONE": "gb",
    "SPA": "be",
    "SUZUKA": "jp",
    "MONZA": "it",
    "MONTREAL": "ca",
    "MELBOURNE": "au",
    "BAKU": "az",
    "SINGAPORE": "sg",
    "ABU DHABI": "ae",
    "AUSTIN": "us",
    "INTERLAGOS": "br",
    "MONACO": "mc",
    "BAHRAIN": "bh",
    "SOCHI": "ru",
    "HUNGARORING": "hu",
    "BARCELONA": "es",
    "ZANDVOORT": "nl",
    "JEDDAH": "sa",
    "IMOLA": "it",
    "PAUL RICARD": "fr",
};

// A map of track names to track country
const trackCountryMap = {
    "SILVERSTONE": "UNITED KINGDOM",
    "SPA": "BELGIUM",
    "SUZUKA": "JAPAN",
    "MONZA": "ITALY",
    "MONTREAL": "CANADA",
    "MELBOURNE": "AUSTRALIA",
    "BAKU": "AZERBAIJAN",
    "SINGAPORE": "SINGAPORE",
    "ABU DHABI": "UNITED ARAB EMIRATES",
    "AUSTIN": "UNITED STATES",
    "INTERLAGOS": "BRAZIL",
    "MONACO": "MONACO",
    "BAHRAIN": "BAHRAIN",
    "SOCHI": "RUSSIA",
    "HUNGARORING": "HUNGARY",
    "BARCELONA": "SPAIN",
    "ZANDVOORT": "NETHERLANDS",
    "JEDDAH": "SAUDI ARABIA",
    "IMOLA": "ITALY",
    "PAUL RICARD": "FRANCE",
};


function TrackSelector({ trackOptions, selectedTrack, onChange }) {
    return (
        <div className="track-selector" onClick={(e) => e.stopPropagation()}>
            <span>{trackCountryMap[selectedTrack]}  </span>
            <span className={`fi fi-${trackFlagMap[selectedTrack]}`}></span>
            <span>  {selectedTrack}</span>
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