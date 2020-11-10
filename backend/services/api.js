
const skytrac = require('./skytrac.js');
const skyrouter = require('./skyrouter.js');
const skytracFlightModel = require('./../models/flight');


async function getSkytracData() {
    let data = await skytrac.getData();
    let flight = new skytracFlightModel.Flight(data[0]);
    console.log(flight.LastPosition.GPSMode);
}


async function getSkyrouterData() {
    let data = await skyrouter.getData();
    console.log(data);
}


// getFlightData();
getSkyrouterData();