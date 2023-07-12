/**
 * Register a new laptime.
 * @constructor
 * @param {string} track - Name of track.
 * @param {string} user - Name of user.
 * @param {string} timestamp - Date and time of input. Format: yyyy-dd-mm_hh-mm-ss (date_time)
 * @param {Boolean} racingline - Bool varaible indicating the use of the racing line
 * Example of use: registerLaptime('SPA', 'EIRIK', '2023-07-10_01:02:04', '01:35:699', true);
 */

function registerLaptime(track, user, timestamp, laptime, racingline) {
    const db = getDatabase();
    update(ref(db, track + '/' + user + '/' + timestamp), {
            'LAPTIME': laptime,
            'RACING_LINE': racingline
        }
    );
}