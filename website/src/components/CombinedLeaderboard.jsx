// import the CombinedLeaderboard.css styling from ../styles/CombinedLeaderboard.css
import { findAndSortLaptimes } from "./Leaderboard";
import { getDatabase, ref, onValue, update, get } from "firebase/database";

import "../styles/Leaderboard.css";

// This component should be a combined leaderboard of all the users in the database.
// Calculate the combined leaderboard points: iterate through each track and add the points for each driver.
// If zero or one laptimes are set at the track, no points are awarded.
// If two laptimes are set at the track, the driver with the quickest laptime gets 1 point and the driver with the second quickest laptime gets 0 points.
// If three or more laptimes are set at the track, the driver with the quickest laptime gets 2 points, the driver with the second quickest laptime gets 1 point, and the driver with the third quickest laptime gets 0 point.
// Generally, (n-1) points are awarded to the driver with the nth quickest laptime.

// Function to calculate the combined leaderboard points
function calculateCombinedLeaderboardPoints(database, trackOptions) {
    const combinedLeaderboardPoints = {};
    for (const trackIndex in trackOptions) {
        if (trackOptions[trackIndex] === "DRIVER STANDINGS") {
            continue;
        }
        const trackRef = ref(database, trackOptions[trackIndex]);
        onValue(trackRef, (snapshot) => {
            const trackData = snapshot.val();
            if (!trackData) {
                return;
            }
            const latestLaptimes = findAndSortLaptimes(trackData);
            for (let i = 0; i < latestLaptimes.length; i++) {
                const driver = latestLaptimes[i].driver;
                if (combinedLeaderboardPoints[driver] === undefined) {
                    combinedLeaderboardPoints[driver] = 0;
                }
                combinedLeaderboardPoints[driver] +=
                    latestLaptimes.length - i - 1;
            }
        });
    }
    return (
        <tbody>
            {Object.entries(combinedLeaderboardPoints)
                .sort((a, b) => b[1] - a[1])
                .map(([driver, points], index) => (
                    <tr key={driver}>
                        <td className="indexColumn">{index + 1}.</td>
                        <td className="driverNameColumn">{driver}</td>
                        <td className="driverStandingsPointsColumn">
                            {points}
                        </td>
                    </tr>
                ))}
        </tbody>
    );
}

export function CombinedLeaderboard({ database, trackOptions }) {
    return (
        <>
            <table className="leaderboard-table">
                {calculateCombinedLeaderboardPoints(database, trackOptions)}
            </table>
        </>
    );
}

export default CombinedLeaderboard;
