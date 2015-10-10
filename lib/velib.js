"use strict";
var request = require('request');
var config = require('../config/config').JCDecaux;

module.exports = function(){
	this.affiche = function(ajout){
		console.log('oui : '+ajout);
	};
	this.checkTrajet = function(idDepart, idArrivee, label){
		var thisForPromise = this;
        return new Promise(function(resolve, reject) {
            thisForPromise.getInfo(idDepart).then(function(depart) {
                thisForPromise.getInfo(idArrivee).then(function(arrivee) {
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
    };
    this.afficheTrajet = function(trajet){
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
    };
    this.getInfo = function(idStation) {
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
	};
	this.afficheStation = function(station){
        if(station.statut == 'CLOSED'){
            console.info('Attention la station '+station.nom+' est fermée !');
        }else{
            var bonus = (station.bonus)?' [B]':'';
            console.info('Station '+station.nom+' :');
            console.info('Vélos : '+station.velos+', places '+bonus+' : '+station.places);
            console.log('Dernière maj : '+station.update.toTimeString());
        }
    };
};

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
};