const request = require('request');
const csv = require('csvtojson');
const moment = require('moment');

const apiUrl = 'https://new.skyrouter.com/BSN.SKyRouter.DataExchange/DataExchangeHandler.ashx';
const apiUser = 'nhvopsAPI';
const apiPass = 'Fenestron1!';

const columnHeaders = ['systemDate', 
                'systemTime',
                'reportType',
                'unitType',
                'IMEI',
                'name',
                'reg',
                'posDate',
                'posTime',
                'lat',
                'lng',
                'alt',
                'gs',
                'trk',
                'precision',
                'receiverStatus',
                'depPlace',
                'arrPlace'];

const typeMapping = {
  PNG: 'T_ON',
  INA: 'T_OFF',
  TOF: 'W_OFF',
  POS: 'FLT',
  LAN: 'W_ON'
};


async function getData() {
//   let types = await app.models.AircraftPositionType.find();
//   let aircraft = await app.models.Aircraft.find();
  
  //   Create startTime to define since when we want data
  let time = moment.utc().startOf('hour');
  let timeApi = moment.utc(time).format('YYYY-MM-DD HH:mm');

  let url = `${apiUrl}?userid=${apiUser}&pw=${apiPass}&source=ft&cmd=since&since=${timeApi}`;

  let aircraftPositions = await csv({ noheader: true, headers: columnHeaders })
  .fromStream(request.get(url));

  for(let p of aircraftPositions) {
    p.timestamp = moment.utc(`${p.posDate}${p.posTime}`, 'YYYYMMDDHHmmss').toISOString();

    // let ac = aircraft.find(a => a.reg === p.reg);
    // let type = types.find(t => t.code === typeMapping[p.reportType]);

    // if(!ac || !type) continue;

    // Create aircraftPosition object
    // let o = {
    //   gs: p.gs,
    //   trk: p.trk,
    //   alt: p.alt,
    //   timestamp: p.timestamp,
    //   aircraft_id: ac.id,
    //   coord: {
    //     lat: p.lat,
    //     lng: p.lng
    //   },
    //   aircraftPositionType_id: type.id
    // }
    // // Update aircraft position
    // let where = {
    //   aircraft_id: o.aircraft_id,
    //   timestamp: o.timestamp
    // }
    // await app.models.AircraftPosition.upsertWithWhere(where, o);

    console.log(p);

  }

//   console.log(`... updated ${aircraftPositions.length}.`);
}


function updateAircraftPosition(where, o) {
    console.log(this);
    // let where = {
    //   aircraft_id: o.aircraft_id,
    //   timestamp: o.timestamp
    // }
    // await app.models.AircraftPosition.upsertWithWhere(where, o);
}


module.exports = { getData };