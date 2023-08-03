// import the CombinedLeaderboard.css styling from ../styles/CombinedLeaderboard.css
import { findAndSortLaptimes } from "./Leaderboard";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import { useState, useEffect } from "react";

import "../styles/Leaderboard.css";

// This component should be a combined leaderboard of all the users in the database.
// Calculate the combined leaderboard points: iterate through each track and add the points for each driver.
// If zero or one laptimes are set at the track, no points are awarded.
// If two laptimes are set at the track, the driver with the quickest laptime gets 1 point and the driver with the second quickest laptime gets 0 points.
// If three or more laptimes are set at the track, the driver with the quickest laptime gets 2 points, the driver with the second quickest laptime gets 1 point, and the driver with the third quickest laptime gets 0 point.
// Generally, (n-1) points are awarded to the driver with the nth quickest laptime.

// Function to calculate the combined leaderboard points

export function CombinedLeaderboard({ database, trackOptions }) {
    const [combinedLeaderboardPoints, setCombinedLeaderboardPoints] =
        useState(null);

    useEffect(() => {
        async function fetchCombinedLeaderboardPoints() {
            const promises = [];
            const points = {};

            for (const trackIndex in trackOptions) {
                if (trackOptions[trackIndex] === "DRIVER STANDINGS") {
                    continue;
                }
                const trackRef = ref(database, trackOptions[trackIndex]);
                const promise = new Promise((resolve, reject) => {
                    onValue(
                        trackRef,
                        (snapshot) => {
                            const trackData = snapshot.val();
                            if (!trackData) {
                                resolve();
                                return;
                            }
                            const latestLaptimes =
                                findAndSortLaptimes(trackData);
                            for (let i = 0; i < latestLaptimes.length; i++) {
                                const driver = latestLaptimes[i].driver;
                                if (points[driver] === undefined) {
                                    points[driver] = 0;
                                }
                                points[driver] += latestLaptimes.length - i - 1;
                            }
                            resolve();
                        },
                        reject
                    );
                });
                promises.push(promise);
            }

            await Promise.all(promises);

            setCombinedLeaderboardPoints(points);
        }

        fetchCombinedLeaderboardPoints();
    }, [database, trackOptions]);

    if (!combinedLeaderboardPoints) {
        return <div>Loading...</div>;
    }

    return (
        <table className="leaderboard-table">
            <tbody>
                {Object.entries(combinedLeaderboardPoints)
                    .sort((a, b) => b[1] - a[1])
                    .map(([driver, points], index) => (
                        <tr
                            key={driver}
                            className={
                                index === 0
                                    ? "first-place"
                                    : index === 1
                                    ? "second-place"
                                    : index === 2
                                    ? "third-place"
                                    : ""
                            }
                        >
                            <td className="indexColumn">{index + 1}.</td>
                            <td className="driverNameColumn">{driver}</td>
                            <td className="driverStandingsPointsColumn">
                                {points}
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
}

export default CombinedLeaderboard;
