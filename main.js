/*
Appel à l'api JC Decaux
15109 : CEVENNES Home
15032 : LOURMEL M 8
15064 : JAVEL M 10

Exemple de retour d'info de station
{
    "number":15109,
    "name":"15109 - CEVENNES",
    "address":"65 - 67 RUE DES CEVENNES - 75015 PARIS",
    "position":{"lat":48.84244145218906,
        "lng":2.281070755215898},
    "banking":true,
    "bonus":false,
    "status":"OPEN",
    "contract_name":"Paris",
    "bike_stands":29,
    "available_bike_stands":1,
    "available_bikes":28,
    "last_update":1443309985000
}
*/

/**
Affiche les informations en français retour de l'appel à l'api
@params station s 
*/
var https = require('https');
var config = require('./config');
var contract_name = 'Paris';
var debug = false;

// options for GET
var optionsget = {
    // here only the domain name
    host : 'api.jcdecaux.com',     
    // (no http/https !)
    port : 443,
    path : '/vls/v1/stations?contract='+contract_name+'&apiKey='+config.key, // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

/* ========================================================================
 Function
======================================================================== */
afficheInfoStation = function (s) {
console.log(s);
    if (s.status === 'CLOSED'){
        console.error('Station '+s.name+' fermée !');
    }else{
        console.info('Station '+s.name+' ouverte :');
    }
    console.info(s.available_bikes+' velib dispo, '+s.available_bike_stands+' attache dispo');
};

var optionsgetStation = function(num){
    return {
        // here only the domain name
        host : 'api.jcdecaux.com', 
        // (no http/https !)
        port : 443,
        path : '/vls/v1/stations/'+config.stations_check[num].number+'?contract='+contract_name+'&apiKey='+config.key,
        method : 'GET' // do GET
    };
};
/* ========================================================================
 Main
======================================================================== */

optionAppel = optionsgetStation(0);
if(debug)console.info('Options prepared:');
if(debug)console.info(optionAppel);
if(debug)console.info('Do the GET call');
 
// do the GET request
var reqGet = https.request(optionAppel, function(res) {
    if(debug)console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
    res.on('data', function(d) {
        if(debug)console.info('GET result:\n');
        process.stdout.write(d+'\n\n');
        // Pourquoi d n'est pas l'objet que process.stdout.write arrive à afficher ?!?
        afficheInfoStation(d);
        if(debug)console.info('\n\nCall completed');
    });
 
});
 
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});