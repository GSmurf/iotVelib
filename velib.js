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

var Trajet = function(stationDepart, stationArrivee, label){
    this.label = label;
    this.stations = stationDepart.nom+' - '+stationArrivee.nom;
    this.velos = stationDepart.velos;
    this.places = stationArrivee.places;
    this.statut = 2; // statut de 0 à 2, 0 = impossible, 1 = alerte, 2 = ok
    this.bonus = stationArrivee.bonus;
    this.messages = [];
    
    if (stationDepart.statut == 'CLOSED') {
        this.statut = 0;
        this.messages.push("La station de départ '+stationDepart.nom+' est fermée");
    };
    if (stationArrivee.statut == 'CLOSED') {
        this.statut = 0;
        this.messages.push("La station d'arrivée '+stationArrivee.nom+' est fermée");
    };
    if (stationDepart.velos < 1) {
        this.statut = 0;
        this.messages.push("Il n'y a pas de vélib disponible");
    };
    if (stationArrivee.places < 1) {
        this.statut = 0;
        this.messages.push("Il n'y a pas de point d'attache disponible");
    };
}

var Velib = {
    getInfo: function(idStation) {
        return new Promise(function(resolve, reject) {
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
    },
    afficheStation: function(station){
        if(station.statut == 'CLOSED'){
            console.info('Attention la station '+station.nom+' est fermée !');
        }else{
            var bonus = (station.bonus)?' [B]':'';
            console.info('Station '+station.nom+' :');
            console.info('Vélos : '+station.velos+', places '+bonus+' : '+station.places);
            console.log('Dernière maj : '+station.update.toTimeString());
        }
    },
    checkTrajet: function(idDepart, idArrivee, label){
        return new Promise(function(resolve, reject) {
            Velib.getInfo(idDepart).then(function(depart) {
                Velib.getInfo(idArrivee).then(function(arrivee) {
                    var trajet = new Trajet(depart, arrivee, label);
                    if (trajet.statut == 0) {
                        reject(trajet);
                    } else{
                        resolve(trajet);
                    };
                }, function(reasonArrivee) {
                  reject(reasonArrivee);
                });
            }, function(reasonDepart) {
              reject(reasonDepart);
            });
        });
    },
    afficheTrajet: function(trajet){
        console.log(trajet.label+' ('+trajet.stations+') :');
        switch(trajet.statut){
            case 0:
                console.log(trajet.messages);
                break;
            case 1:
                console.log('Attention !');
            case 2:
                console.info(trajet.velos+' velo(s) t\'attendent, pour '+trajet.places+'  de libre !');
                break;
        }
    }
};

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