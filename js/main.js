"use strict";
var Velib = require('../lib/velib');
var config = require('../config/config').JCDecaux;

var trajets = [];
var stations = [];
var velib = new Velib();


for (var i = config.trajets_check.length - 1; i >= 0; i--) {
    var trajet = config.trajets_check[i];
    velib.checkTrajet(trajet.from, trajet.to, trajet.name).then(function(trajet){
        trajets.push(trajet);
        afficheLesTrajets(trajets);
    }, function(reason){
        afficheLesTrajets();
    });
};

for (var i = config.stations_check.length - 1; i >= 0; i--) {
    var station = config.stations_check[i];
    velib.getInfo(station.number).then(function(station){
        stations.push(station);
        afficheLesStations(station);
    }, function(reason){
        afficheLesStations();
    });
};

var afficheLesTrajets = function(trajets){
    for (var i = trajets.length - 1; i >= 0; i--) {
        var ret = velib.afficheTrajet(trajets[i]);

        var node = document.createElement("LI");                 // Create a <li> node
        var textnode = document.createTextNode(ret);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById("mesTrajets").appendChild(node);     // Append <li> to <ul> with id="myList"
    };
};

var afficheLesStations = function(stations){
    var ret = velib.afficheStation(stations);
    var node = document.createElement("LI");                 // Create a <li> node
    var textnode = document.createTextNode(ret);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("mesStations").appendChild(node);     // Append <li> to <ul> with id="myList"
};