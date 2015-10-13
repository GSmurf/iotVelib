"use strict";
var Velib = require('../lib/velib');

var trajets = [];
var velib = new Velib();

velib.checkTrajet(15062, 15109, "retour homy du M8").then(function(trajet){
    trajets.push(trajet);
    velib.checkTrajet(15064, 15109, "retour homy du M10").then(function(trajet){
        trajets.push(trajet);
        afficheLesTrajets(trajets);
    }, function(reason){
        afficheLesTrajets();
    });
}, function(reason){
    afficheLesTrajets();
});

var afficheLesTrajets = function(trajets){
    for (var i = trajets.length - 1; i >= 0; i--) {
        var ret = velib.afficheTrajet(trajets[i]);

        var node = document.createElement("LI");                 // Create a <li> node
        var textnode = document.createTextNode(ret);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById("mesTrajets").appendChild(node);     // Append <li> to <ul> with id="myList"
    };
};