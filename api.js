const axios = require('axios');
const transactionId = 1;
chargingApi = 'https://restmock.techgig.com/merc/charge_level';
stationApi = 'https://restmock.techgig.com/merc/charging_stations';
distanceApi = 'https://restmock.techgig.com/merc/distance';

//find charge details of vehicle; input: vehicle numbers
const getCharge = async (vin) => {
    body = { "vin": vin }
    const data = await axios.post(chargingApi, body);
    return data.data;
}
// find Charging stations from api; input: source, destination
const getStations = async (source, destination) => {
    body = { "source": source, "destination": destination }
    const data = await axios.post(stationApi, body);
    return data.data
}
// find distance; input: source, destination
const getDistance = async (source, destination) => {
    body = { "source": source, "destination": destination }
    const data = await axios.post(distanceApi, body);
    return data.data;
}

module.exports = {
    getCharge,
    getStations,
    getDistance
}


