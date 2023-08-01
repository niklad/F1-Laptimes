// import the CombinedLeaderboard.css styling from ../styles/CombinedLeaderboard.css
import "../styles/CombinedLeaderboard.css";

// This component should be a combined leaderboard of all the users in the database.
// Calculate the combined leaderboard points: iterate through each track and add the points for each driver.
// If zero or one laptimes are set at the track, no points are awarded.
// If two laptimes are set at the track, the driver with the quickest laptime gets 1 point and the driver with the second quickest laptime gets 0 points.
// If three or more laptimes are set at the track, the driver with the quickest laptime gets 2 points, the driver with the second quickest laptime gets 1 point, and the driver with the third quickest laptime gets 0 point.
// Generally, (n-1) points are awarded to the driver with the nth quickest laptime.
// The database is strucutred as:
// {
//   "INTERLAGOS": {
//     "RUN": {
//       "2023_07_24T16_38_02_628Z": {
//         "LAPTIME": "1:13.493",
//         "RACING_LINE": true
//       }
//     },
//     "SAM": {
//       "2023_07_24T16_37_34_964Z": {
//         "LAPTIME": "1:10.812",
//         "RACING_LINE": false
//       }
//     },
//     "STR": {
//       "2023_07_24T16_37_44_546Z": {
//         "LAPTIME": "1:11.699",
//         "RACING_LINE": false
//       }
//     }
//   },
//     "ZANDVOORT": {
//     "GRA": {
//       "2023_07_30T15_10_08_747Z": {
//         "LAPTIME": "1:18.101",
//         "RACING_LINE": true
//       },
//       "2023_07_30T15_14_54_282Z": {
//         "LAPTIME": "1:26.998",
//         "RACING_LINE": false
//       },
//     },
//     "NYL": {
//       "2023_07_31T13_00_01_101Z": {
//         "LAPTIME": "1:50.995",
//         "RACING_LINE": true
//       },
//       "2023_07_31T13_08_33_471Z": {
//         "LAPTIME": "1:42.239",
//         "RACING_LINE": true
//       },
//     },
//     "SAM": {
//       "2023_07_30T14_58_40_876Z": {
//         "LAPTIME": "1:14.819",
//         "RACING_LINE": true
//       },
//       "2023_07_30T15_01_30_317Z": {
//         "LAPTIME": "1:15.509",
//         "RACING_LINE": false
//       },
//     },
//     "STR": {
//       "2023_07_30T15_23_06_924Z": {
//         "LAPTIME": "1:22.860",
//         "RACING_LINE": false
//       },
//       "2023_07_30T15_26_02_910Z": {
//         "LAPTIME": "1:1ō.709",
//         "RACING_LINE": false
//       }
//     }
//   }
// The combined leaderboard should be sorted by the combined leaderboard points.
// }

// Function to calculate the combined leaderboard points
const calculateCombinedLeaderboardPoints = (db) => {
    // Initialize the combined leaderboard points object
    const combinedLeaderboardPoints = {};
};

export function CombinedLeaderboard() {}

export default CombinedLeaderboard;
