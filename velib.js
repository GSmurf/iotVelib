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
    getInfo: function(idStation, affiche){
        request.get({url:'https://api.jcdecaux.com/vls/v1/stations/'+idStation+'?contract='+config.contract_name+'&apiKey='+config.api_key,
            contract:config.contract_name,
            json:true}, function (e, r, st) {
                if (st.error == 'Unauthorized') {
                    console.warn("Action non-autorisée, votre clé API Jc Decaux n'est surement pas valide.\nVous avez saisi : "+config.api_key);
                    return false;
                } else{
                    var station = new Station(st);
                    if (affiche === undefined) {
                        Velib.afficheStation(station);
                    }else{
                        return station;
                    };
                };
            }
        );
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
    checkTrajet: function(depart, arrivee){
        var depart = Velib.getInfo(id_depart);
        var arrivee = Velib.getInfo(id_arrivee);
        var error = false;
        var message = [];
        
        if (depart.status == CLOSED) {
            var error = true;
            message.push('La station de départ '+depart.name.substr(8, depart.name.length)+' est fermée');
        };
        if (arrivee.status == CLOSED) {
            var error = true;
            message.push('La station d\'arrivée '+arrivee.name.substr(8, arrivee.name.length)+' est fermée');
        };
        if (depart.available_bikes < 1) {
            var error = true;
            message.push('Il n\'y a pas de vélib disponible');
        };
        if (arrivee.available_bike_stands < 1) {
            var error = true;
            message.push('Il n\'y a pas de point d\'attache disponible');
        };
    }
};

Velib.getInfo(15109); // 15109 : CEVENNES Home
Velib.getInfo(15032); // 15032 : LOURMEL M 8
Velib.getInfo(15064); // 15064 : JAVEL M 10