"use strict";
var request = require('request');

var api_key       = '32e916af1279a6c523ca33b1d1026298af3806e7';
var contract_name = 'Paris';

var Station = function(st){
    this.velos = st.available_bikes;
    this.places = st.available_bike_stands;
    this.statut = st.status;
    this.bonus = st.bonus;
    this.nom = st.name.substr(8, st.name.length);
    this.update = new Date(st.last_update);
};

var Velib = {
    getInfo: function(obj){
        request.get({url:'https://api.jcdecaux.com/vls/v1/stations/'+obj.id+'?contract='+contract_name+'&apiKey='+api_key,
            contract:contract_name,
            json:true}, function (e, r, st) {
                obj.variable = new Station(st);
                Velib.afficheStation(obj.variable);
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

var cevennes = {id:15109, variable};
var lourmel = {id:15032, variable};
var javel = {id:15064, variable};

Velib.getInfo(cevennes); // 15109 : CEVENNES Home
Velib.getInfo(lourmel); // 15032 : LOURMEL M 8
Velib.getInfo(javel); // 15064 : JAVEL M 10

setTimeout(function(){
    Velib.afficheStation(javel.variable);
}, 3000);