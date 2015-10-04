"use strict";
var request = require('request');
var config = require('./config').JCDecaux;

var Station = function(st){
    this.velos = st.available_bikes;
    this.places = st.available_bike_stands;
    this.statut = st.status;
    this.bonus = st.bonus;
    this.nom = st.name.substr(8, st.name.length);
    this.update = new Date(st.last_update);
};

var Velib = {
    getInfo: function(idStation) {
        var API = new Promise(function(resolve, reject) {
            request.get({url:'https://api.jcdecaux.com/vls/v1/stations/'+idStation+'?contract='+config.contract_name+'&apiKey='+config.api_key,
                contract:config.contract_name,
                json:true}, function (e, r, st) {
                    if (st.error == 'Unauthorized') {
                        reject("Action non-autorisée, votre clé API Jc Decaux n'est surement pas valide.\nVous avez saisi : "+config.api_key);
                    } else{
                        var station = new Station(st);
                        resolve(station);
                    };
                }
            );
        });

        return API;
    },
    afficheStation: function(station){
        if(station.statut == 'CLOSED'){
            console.info('Attention la station '+station.nom+' est fermée !')
        }else{
            var bonus = (station.bonus)?' [B]':'';
            console.info('Station '+station.nom+' :')
            console.info('Vélos : '+station.velos+', places '+bonus+' : '+station.places)
            console.log('Dernière maj : '+station.update.toTimeString())
        }
    },
    checkTrajet: function(idDepart, idArrivee, label){
        Velib.getInfo(idDepart).then(function(depart) { // 15109 : CEVENNES Home
            Velib.getInfo(idArrivee).then(function(arrivee) { // 15032 : LOURMEL M 8
                var error = false;
                var message = [];
                
                if (depart.statut == 'CLOSED') {
                var error = true;
                message.push("La station de départ '+depart.nom+' est fermée");
                };
                if (arrivee.statut == 'CLOSED') {
                var error = true;
                message.push("La station d'arrivée '+arrivee.nom+' est fermée");
                };
                if (depart.velos < 1) {
                var error = true;
                message.push("Il n'y a pas de vélib disponible");
                };
                if (arrivee.places < 1) {
                var error = true;
                message.push("Il n'y a pas de point d'attache disponible");
                };

                // Affichage du trajet
                console.info(label);
                if (error) {
                    console.warn(message);
                } else{
                    console.info(depart.velos+' velo(s) t\'attendent à '+depart.nom+', pour '+arrivee.places+'  de libre à '+arrivee.nom+' !');
                };

            }, function(reason) {
              console.log(reason); // Error!
            });
        }, function(reason) {
          console.log(reason); // Error!
        });
    }
};

Velib.checkTrajet(15109, 15032, "pour M8");
Velib.checkTrajet(15109, 15064, "pour M10");

Velib.checkTrajet(15032, 15109, "retour homy du M8");
Velib.checkTrajet(15064, 15109, "retour homy du M10");

// affichage des stations
/*
Velib.getInfo(15109).then(function(value) { // 15109 : CEVENNES Home
  Velib.afficheStation(value);
    Velib.getInfo(15032).then(function(value) { // 15032 : LOURMEL M 8
      Velib.afficheStation(value);
        Velib.getInfo(15064).then(function(value) { // 15064 : JAVEL M 10
          Velib.afficheStation(value);
        }, function(reason) {
          console.log(reason); // Error!
        });
    }, function(reason) {
      console.log(reason); // Error!
    });
}, function(reason) {
  console.log(reason); // Error!
});
*/