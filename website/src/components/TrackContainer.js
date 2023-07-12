// The highest level container that contains everything else on the page.
// The data that the container is rendered with depends on the object that is passed in as a prop.

import React from 'react';
import Leaderboard from './TrackContainer/Leaderboard';

const TrackContainer = ({ trackData }) => {
    return (
        <>
            <Leaderboard trackData={trackData} />
        </>
    );
};

export default Leaderboard;