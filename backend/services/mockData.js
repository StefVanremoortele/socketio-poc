
const moment = require('moment');

function flightData() {
    let flightData = {
        'timestamp': moment().utc(),
        'gs': '132',
        'trk': '1432',
        'alt': '432',
        'aircraftPositionType_id': 'FLT',
        'aircraft_id': '10',
        'coord': {
            'lng': Math.floor(100 + Math.random() * 10),
            'lat': Math.floor(200 + Math.random() * 10)
        }
    }
    return flightData;
}

module.exports = { flightData };