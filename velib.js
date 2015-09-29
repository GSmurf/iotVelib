var request = require('request');

var api_key           = '32e916af1279a6c523ca33b1d1026298af3806e7';
var stationTest   = 15109;
var contract_name = 'Paris';

// var url = 'https://api.jcdecaux.com/vls/v1/stations?contract='+contract_name+'&apiKey='+api_key;
var url = 'https://api.jcdecaux.com/vls/v1/stations/'+stationTest+'?contract='+contract_name+'&apiKey='+api_key;

var afficheStation = function(station){
  if(station.status == 'CLOSED'){
  	console.info('Attention la station est fermée !')
  }else{
  	  var bonus = (station.bonus)?' [B]':'';
  	  var date = new Date(station.last_update);
	  console.info('Vélos dispos : '+station.available_bikes)
	  console.log('places dispos'+bonus+' : '+station.available_bike_stands)
	  console.log('Dernière maj : '+date.toTimeString())
  }

}
request.get({url:url, contract:contract_name, json:true}, function (e, r, station) {
	afficheStation(station);
})