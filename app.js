const tester = require('./api');
let transactionId = 1;
const express = require('express');
const path = require('path');
const port = 3000;
const app = express();
console.log(__dirname);

app.use(express.json());
app.get('/', (req, res) =>{
    res.send("Started");
});
app.post('/api/getRouteInfo',(req, res) =>{
    transactionId = ++transactionId;
    length = Object.keys(req.body).length;
    if(length ===3 && "source" in req.body && "destination" in req.body && "vin" in req.body){
        charge = tester.getCharge(req.body.vin).then(charge=>{
            if(charge.error === null){

                distance = tester.getDistance(req.body.source, req.body.destination).then(distance =>{
                if(distance.error === null){
                    if(distance.distance <= charge.currentChargeLevel)
                    {
                        output = { "transactionId": transactionId, 
                        "vin": charge.vin, 
                        "source": distance.source, 
                        "destination": distance.destination, 
                        "distance": distance.distance, 
                        "currentChargeLevel": charge.currentChargeLevel, 
                        "isChargingRequired": false, 
                        }
                        return res.status(200).json(output)
                    }
                    else
                    {
                        stations = tester.getStations(req.body.source, req.body.destination).then(stations =>{
                        if(stations.chargingStations === null){
                            if(distance.distance <= charge.currentChargeLevel){
                                output = { "transactionId": transactionId, 
                                "vin": charge.vin, 
                                "source": distance.source, 
                                "destination": distance.destination, 
                                "distance": distance.distance, 
                                "currentChargeLevel": charge.currentChargeLevel, 
                                "isChargingRequired": true, 
                                "chargingStations": stations.chargingStations }
                                return res.status(200).json(output);
                            }
                            else{
                                output = { "transactionId": transactionId, 
                                "vin": charge.vin, 
                                "source": distance.source, 
                                "destination": distance.destination, 
                                "distance": distance.distance, 
                                "currentChargeLevel": charge.currentChargeLevel, 
                                "isChargingRequired": true, 
                                "errors": [ { "id": 8888, "description": "Unable to reach the destination with the current fuel level" } ] }
                                return res.status(200).json(output);
                            }
                            
                        }
                        if(stations.error === null){
                            var newCharge = (charge.currentChargeLevel)
                            allStations= stations.chargingStations;
                            allStations.forEach(element => {
                                newCharge = newCharge + element.limit
                                if(distance.distance <= newCharge){
                                    global.flag = true;
                                }
                                else{
                                    global.flag = false;
                                }
                            });
                            if(flag === true){
                                output = { "transactionId": transactionId, 
                                "vin": charge.vin, 
                                "source": distance.source, 
                                "destination": distance.destination, 
                                "distance": distance.distance, 
                                "currentChargeLevel": charge.currentChargeLevel, 
                                "isChargingRequired": true, 
                                "chargingStations": stations.chargingStations }
                                return res.json(output);
                            }
                            else
                            {
                                console.log(global.flag);
                                output = { "transactionId": transactionId, 
                                "vin": charge.vin, 
                                "source": distance.source, 
                                "destination": distance.destination, 
                                "distance": distance.distance, 
                                "currentChargeLevel": charge.currentChargeLevel, 
                                "isChargingRequired": true, 
                                "errors": [ { "id": 8888, "description": "Unable to reach the destination with the current fuel level" } ] }
                                return res.status(200).json(output);
                            }
                        }
                        else{
                            output = { "transactionId": transactionId, 
                                "vin": charge.vin, 
                                "source": distance.source, 
                                "destination": distance.destination, 
                                "distance": distance.distance, 
                                "currentChargeLevel": charge.currentChargeLevel, 
                                "isChargingRequired": false,
                                "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                                }
                                return res.status(400).json(output);
                            }
                        })
                    }
                }
                else{
                    output = { "transactionId": transactionId, 
                    "vin": charge.vin, 
                    "source": distance.source, 
                    "destination": distance.destination, 
                    "distance": distance.distance, 
                    "currentChargeLevel": charge.currentChargeLevel, 
                    "isChargingRequired": false,
                    "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                    }
                    return res.status(400).json(output);
                }
                })
            }
            else{
                output = { "transactionId": transactionId, 
                    "vin": charge.vin, 
                    "source": distance.source, 
                    "destination": distance.destination, 
                    "distance": distance.distance, 
                    "currentChargeLevel": charge.currentChargeLevel, 
                    "isChargingRequired": false,
                    "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                    }
                    return res.status(400).json(output);
            }
        })
    }
    else{
        output = { "transactionId": transactionId, 
                    "vin": charge.vin, 
                    "source": distance.source, 
                    "destination": distance.destination, 
                    "distance": distance.distance, 
                    "currentChargeLevel": charge.currentChargeLevel, 
                    "isChargingRequired": false,
                    "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                    }
                    return res.status(400).json(output);
    }
});
app.listen(port, ()=>{
    console.log("Server started on port 8080")
});
