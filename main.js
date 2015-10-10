"use strict";

// var Velib = require('./lib/Velib');

var trajets = [];
var Velib = require('./lib/Velib');
var velib = new Velib();
velib.checkTrajet(15064, 15109, "retour homy du M10").then(function(trajet){
    trajets.push(trajet);
    afficheLesTrajets(trajets);
}, function(reason){
    afficheLesTrajets();
});

var afficheLesTrajets = function(trajets){
    for (var i = trajets.length - 1; i >= 0; i--) {
        velib.afficheTrajet(trajets[i]);
    };
};