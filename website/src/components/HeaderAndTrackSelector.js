import React from 'react';

import "/node_modules/flag-icons/css/flag-icons.min.css";


// A map of track names to flag icons
const trackFlagMap = {
    "SILVERSTONE": "gb",
    "SPA": "be",
};

// A map of track names to track country
const trackCountryMap = {
    "SILVERSTONE": "UNITED KINGDOM",
    "SPA": "BELGIUM",
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