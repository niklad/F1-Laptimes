import React from 'react';


function TrackSelector({ trackOptions, selectedTrack, onChange }) {
    return (
        <div className="track-selector" onClick={(e) => e.stopPropagation()}>
            <span>{selectedTrack}</span>
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