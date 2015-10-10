"use strict";
var request = require('request');
var config = require('../config/config').JCDecaux;
var Velib = require('../lib/velib');

/* ========================================================================
* Function
======================================================================== */
var afficheLesTrajets = function(trajets){
    for (var i = trajets.length - 1; i >= 0; i--) {
        Velib.afficheTrajet(trajets[i]);
    };
};
/* ========================================================================
* Main
======================================================================== */
/*
var trajets = [];
Velib.checkTrajet(15109, 15032, "pour M8").then(function(trajet){
    trajets.push(trajet);
    Velib.checkTrajet(15109, 15064, "pour M10").then(function(trajet){
        trajets.push(trajet);
        Velib.checkTrajet(15032, 15109, "retour homy du M8").then(function(trajet){
            trajets.push(trajet);
            Velib.checkTrajet(15064, 15109, "retour homy du M10").then(function(trajet){
                trajets.push(trajet);
                afficheLesTrajets(trajets);
            }, function(reason){
                afficheLesTrajets();
                Velib.afficheTrajet(trajet);
            });
        }, function(reason){
            afficheLesTrajets();
            Velib.afficheTrajet(trajet);
        });
    }, function(reason){
        afficheLesTrajets();
        Velib.afficheTrajet(trajet);
    });
}, function(reason){
    afficheLesTrajets();
    Velib.afficheTrajet(trajet);
});
*/

// affichage des stations
/*
Velib.getInfo(15109).then(function(value) { // 15109 : CEVENNES Home
  Velib.afficheStation(value);
    Velib.getInfo(15032).then(function(value) { // 15032 : LOURMEL M 8
      Velib.afficheStation(value);

*/      
        Velib.getInfo(15064).then(function(value) { // 15064 : JAVEL M 10
          Velib.            


                                (value);
        }, function(reason) {
          console.log(reason); // Error!
        });
/*          
    }, function(reason) {
      console.log(reason); // Error!
    });
}, function(reason) {
  console.log(reason); // Error!
});
*/