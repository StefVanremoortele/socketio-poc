

class GeoReference {
    Deleted;
    Ident;
    Longitude;
    Latitude;
    Name;
    Prominence;
    Region;
    Specific;
    GeoType;

    constructor(obj) {
        if (!obj) return;
        Object.assign(this, obj);
    }
}

class LastPosition {
    Altitude;
    Latitude;
    Longitude;
    Speed;
    Track;
    PosnTypeDescription;
    PosnType;
    PosnTime;
    GateTime;
    AssetName;
    GeoReference = new GeoReference(null);
    Source;
    GPSMode;
    GeoDistance;
    Latitude_String;
    Longitude_String;
    ReportingRegion;

    constructor(obj) {
        if (!obj) return;
        Object.assign(this, obj, {
            GeoReference: {
                ...new GeoReference(obj.GeoReference),
            }
        });
    }
}

class Flight {
    aircraftType;
    callSign;
    IMEI;
    LastPosition = new LastPosition(null);;
    phoneNumber;
    unitName;
    allowEmail;
    allowPhone;

    constructor(obj) { // Object.assign(this, data);
        Object.assign(this, obj, {
            LastPosition: {
                ...new LastPosition(obj.LastPosition),
            }
        });
        // for (var prop in obj) this[prop] = obj[prop];
    }
}
module.exports = { Flight: Flight };
