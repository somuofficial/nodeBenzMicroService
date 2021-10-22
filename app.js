const tester = require('./api');
const express = require('express');
const path = require('path');
const port = 3000;
const app = express();
let transactionId = 1;

app.use(express.json());
// endPoint /api/getRouteInfo; input: vin, source, destination
// this is the main microservice
app.post('/api/getRouteInfo',(req, res) =>{
    transactionId = ++transactionId;
    length = Object.keys(req.body).length;
    if(length ===3 && "source" in req.body && "destination" in req.body && "vin" in req.body){
        //find charge details
        charge = tester.getCharge(req.body.vin).then(charge=>{
            if(charge.error === null){
                //find distance details
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
                        //find all charging stations
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
                            for (let i=0; i < allStations.length ; i++){
                                newCharge = newCharge + allStations[i].limit
                                if(newCharge >= distance.distance){
                                    global.flag = true;
                                    global.ind = allStations.indexOf(allStations[i])
                                    break;
                                }
                                else{
                                    global.flag = false;
                                }
                            }
                            if(flag === true){
                                
                                output = { "transactionId": transactionId, 
                                "vin": charge.vin, 
                                "source": distance.source, 
                                "destination": distance.destination, 
                                "distance": distance.distance, 
                                "currentChargeLevel": charge.currentChargeLevel, 
                                "isChargingRequired": true, 
                                "chargingStations": allStations.slice(0,ind+1) }
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
                                "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                                }
                                return res.status(400).json(output);
                            }
                        })
                    }
                }
                else{
                    output = { "transactionId": transactionId, 
                    "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                    }
                    return res.status(400).json(output);
                }
                })
            }
            else{
                output = { "transactionId": transactionId, 
                    "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                    }
                    return res.status(400).json(output);
            }
        })
    }
    else{
        output = { "transactionId": transactionId, 
                    "errors": [{ "id": 9999, "description": "Technical Exception" } ] 
                    }
                    return res.status(400).json(output);
    }
});
app.listen(port, ()=>{
    console.log("Server started on port 8080")
});
