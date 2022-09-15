const express = require('express');
const https = require('https');
const _ = require('lodash');

const GeoJSON = require('geojson');

const {serviceName, version, config, cors} = require('../base');

const app = express();

app.use(cors);

const codes = require('./signs/codes.json');

const mapCodes = {};

codes.forEach(item => {
    if(item.code!='N' && item.code!='S')
        item.img = `images/${item.code}.png`;
    mapCodes[`${item.code}`] = item;
});

var lastUpdate = Math.trunc((new Date()).getTime() / 1000 ),
    stationsReceived;

const stations = [];

console.log(`Starting ${serviceName}...`);

console.log("Config:\n", JSON.stringify(config,null,2));

if(!config.endpoints || _.isEmpty(config.endpoints)) {
    console.error('Config endpoints not defined!');
    return;
}

//TODO up to here MOVE in LIB module

function getData() {
    lastUpdate = Math.trunc((new Date()).getTime() / 1000 );
    getStations();
    //console.log('POLLING',stationsReceived)
}
getData();
setInterval(getData, config.polling_interval * 1000);

function filterMetadata(tmp,scode) {

    const opath = scode ? [
        'VMS',
        'stations',
         scode,
        'sdatatypes',
        'esposizione',
        'tmetadata'
        ] : 'tmetadata';

    if (_.isArray(tmp.data)) {
        for(let e of tmp.data) {
            _.set(e, opath, {});
        }
    }
    _.set(tmp.data, opath, {});
    //remove unuseful big field
    //console.log('FILTER',JSON.stringify(tmp,null,4))
    return tmp;
}

function formatData() {
    if(stationsReceived && stations.length === 0) {
        //console.log(stationsReceived)
        for(let i = 0; i < stationsReceived.length; i++){
            let station = stationsReceived[i];

            if(station.scoordinate) {

                const type = station.smetadata.pmv_type;
                const type_name = config.pmv_types[ station.smetadata.pmv_type ];

                const direction = config.directions_types[ station.smetadata.direction_id ] || '';

                let value = `${station.mvalue}`.trim();

                let text = value,
                    img = '';

                if (mapCodes[value]) {
                    text = mapCodes[value].title;
                    img = mapCodes[value].img;
                }

                if (value.indexOf('|')) {       //bilingual it|de
                    value = value.split('|')[0];
                }

                /*La policy A22 è quello di prevedere un carosello
                solo in Alto Adige dove la messaggistica è bilingue. Si propone di salvare in ogni caso il
                messaggio concatenato associato a tutte le pagine presenti, usando un carattere delimitatore
                tra una pagina e l’altra (es. “|”).
                */

console.log('STATION PUSH',station)

                stations.push({
                    station_id: station.scode,
                    name: station.sname,
                    lat: station.scoordinate.y,
                    lon: station.scoordinate.x,
                    origin: station.sorigin,
                    time: station.mvalidtime,
                    direction,
                    //position: station.smetadata.position_m,
                    type,
                    type_name,
                    text,
                    img
                })
            }
        }

        //normalize by coorindates
        //
        console.log('STATIONS',stations.length)
    }
}

function getStations() {

    console.log('REQUEST',config.endpoints.stations.path);

    https.request(config.endpoints.stations, res => {
        var str = "";

        console.log('RESPONSE',res.statusCode, config.endpoints.stations.path)
        if (res.statusCode===200) {
            res.on('data', chunk => {
                str += chunk;
            }).on('end', () => {
                try {
                    let tmp = JSON.parse(str);

                    filterMetadata(tmp);

                    stationsReceived = tmp.data;
                    console.log('stationsReceived',_.size(stationsReceived))
                    formatData();
                }
                catch(err) {
                    console.log('RESPONSE empty',err)
                }
            });
        }
        else {
            console.error(`Error to retrieve data, statusCode ${res.statusCode} try to run ./token.sh or ./token_refresh.sh`)
        }
    }).on('error', error => {
        console.error('RESPONSE ERR',error);
    }).end();
}

function getOneStation(scode=''){

    return new Promise((resolve, reject) => {

        if(scode==='') {
            reject(null)
            return
        }

        const result = _.find(stationsReceived,{'scode':scode})
console.log(result)
        resolve(result)
/*
        const reqOpts = Object.assign({}, config.endpoints.station, {
            path: _.template(config.endpoints.station.path)({scode})
        });

        https.request(reqOpts, res => {
            var str = "";
            res.on('data', function (chunk) {
                str += chunk;
            }).on('end', function () {
                const tmp = JSON.parse(str);

                filterMetadata(tmp,scode)

console.log('getOneStation',JSON.stringify(tmp,null,4))

                resolve(tmp.data);
            });
        }).on('error', error => {
            reject(error)
        }).end();*/
    });
}

app.get('/vms/stations.json', (req, res) => {

    res.json({
        last_updated: lastUpdate,
        ttl: 0,
        version,
        data: {
            stations
        }
    });
});

app.get('/vms/stations.geojson', (req, res) => {

    const geo = GeoJSON.parse(stations, {
        Point: ['lat', 'lon']
    });

    res.json(geo);
});

//one station details
app.get('/vms/:scode/station.json',  function (req, res) {

    const scode = req.params.scode;

    if (scode) {
        getOneStation(scode).then(data => {

            res.json({
                last_updated: lastUpdate,
                ttl: 0,
                version,
                data
            });
        });
    }
    else {
        res.status(400);
    }
});

app.use('/vms/images', express.static('signs/images'));

app.use('/vms/map', express.static('map.html'));

app.get('/vms/signs.json',  function (req, res) {
    res.json({
        last_updated: lastUpdate,
        ttl: 0,
        version,
        data: {
            signs: codes
        }
    });
});

app.get(['/','/vms'], async (req, res) => {
  res.send({
    status: 'OK',
    version
  });
});

app.listen(config.listen_port, function () {
    console.log( app._router.stack.filter(r => r.route).map(r => `${Object.keys(r.route.methods)[0]} ${r.route.path}`) );
    console.log(`${serviceName} listening at http://localhost:${this.address().port}`);
});