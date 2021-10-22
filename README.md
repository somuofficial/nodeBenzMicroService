download from github using clone

To build container run: docker build -t node-benz-api .

To start on on port 8080 run: docker run -it -p 8080:3000 node-benz-api

use the end point /api/getRouteInfo 
port: 8080

inputs: {vin: "vehicle numbe", source: "source location", destination: "destination location"}
