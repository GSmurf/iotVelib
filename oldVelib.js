var config = require('./config');
var myApp = angular.module('scenari', ['uiSwitch', 'ngDragDrop']);
var ref = new Firebase("https://r2d2-switch.firebaseio.com/"); // accès à la base de données Firebase
var timingSleep = 1000; // temps en milliseconde pour attendre entre chaque actions

myApp.controller('ScenariListCtrl', function ($scope, $http, $timeout) {
  var urlspeak = 'http://r2d2/switch/c3po.php';
  var jcDecauxApiKey = config.key; 
  var jcDecauxStations = [15109, 15032, 15069, 15064]; 
  $scope.velib = [];
  $scope.scenari = [];
  $scope.list1 = [{"type": 'switch',"value": 'on',"id": 1}, 
                  {"type": "wol","value": '00:21:9b:15:4b:d5'}, 
                  {"type": "timer","value": 2000}, 
                  {"type": "message","value": 'Dancing to the end of love !'},
                  {"type": "speak", "value":"Salut Stef!"}
                 ];
  $scope.newScenario = {nom:'', description:'', actif:true, actions:[]};

  /*
   * Chargement des données
   */

  // TODO : Cette fonction etant un appel ajax c'est de maniere asynchrone qu'il retourne la valeur d'ou l'erreur
  $scope.velibLoadInfos = function(key){
	  $http.get("https://api.jcdecaux.com/vls/v1/stations/"+key+"?contract=Paris&apiKey="+jcDecauxApiKey).
	  success(function(dataVelibLoadInfos) {
		  return {'number':dataVelibLoadInfos.number,
			  	  'status':dataVelibLoadInfos.status, 
				  'name':dataVelibLoadInfos.name.substring(8, dataVelibLoadInfos.name.length), 
				  'available_bike_stands':dataVelibLoadInfos.available_bike_stands, 
				  'available_bikes':dataVelibLoadInfos.available_bikes
				  };
	  });
  };
  
//  $scope.velibLoadInfos = function(key){
//	  console.log('key : '+key);
//	  var toto;
//	  $http.get("https://api.jcdecaux.com/vls/v1/stations/"+key+"?contract=Paris&apiKey="+jcDecauxApiKey).
//	  success(function(dataVelibLoadInfos) {
//		  console.log('ok!');
//		  toto={'number':dataVelibLoadInfos.number,
//				  'status':dataVelibLoadInfos.status, 
//				  'name':dataVelibLoadInfos.name.substring(8, dataVelibLoadInfos.name.length), 
//				  'available_bike_stands':dataVelibLoadInfos.available_bike_stands, 
//				  'available_bikes':dataVelibLoadInfos.available_bikes
//		  };
//		  console.log(toto);
//	  }).
//	  error(function(){
//		  console.log('ko!');
//	  });
//	  console.log(toto);
//  }(15109);
  
//  angular.forEach(jcDecauxStations, function(key) {
//	  $scope.velib.push($scope.velibLoadInfos(key));
//	});
  
  angular.forEach(jcDecauxStations, function(key) {
	  $http.get("https://api.jcdecaux.com/vls/v1/stations/"+key+"?contract=Paris&apiKey="+jcDecauxApiKey).
			  success(function(dataVelibLoadInfos) {
				  $scope.velib.push({'number':dataVelibLoadInfos.number,
					  	  'status':dataVelibLoadInfos.status, 
						  'name':dataVelibLoadInfos.name.substring(8, dataVelibLoadInfos.name.length), 
						  'available_bike_stands':dataVelibLoadInfos.available_bike_stands, 
						  'available_bikes':dataVelibLoadInfos.available_bikes
						  });
			  });
  });
  
  $http.get('js/scenari.json').success(function(data){
	  $scope.scenari = data;
  });
  
  /*
   * Fonctions
   */
  $scope.hideMe = function() {
    return $scope.newScenario.actions.length > 0;
  };

  $scope.reinitialiseForm = function(){
        $scope.newScenario = {nom:'', description:'', actif:true, actions:[]};
  };
  
  $scope.ajouterScenario = function() {
      $scope.scenari.push($scope.newScenario);

      // enregistre dans firebase la valeur saisie
      var refScenari = ref.child("scenari");
  	  refScenari.push(angular.copy($scope.newScenario));

      $scope.reinitialiseForm();
  };

  $scope.supprimerAction = function(action) {
    var index=$scope.newScenario.actions.indexOf(action);
    $scope.newScenario.actions.splice(index,1);  
  };

  $scope.ajouterAction = function() {
    $scope.newScenario.actions.push({"type": "switch","value": "on","id": "1"}); 
  };
  
  $scope.wol = function (mac){
	  $http.get('switch.php?mac='+mac+'&action=wol'); 
  };
  
  $scope.interrupteurSwitch = function (inter, val){
	  $http.get('switch.php?inter='+inter+'&action='+val);	
  };
  
  $scope.speak = function(action) {
	  $http.get(urlspeak+'?text='+action.value); 
  };

  $scope.toggleActif = function(scenario) {
    scenario.actif = !scenario.actif;
  };

  $scope.remove = function(item){ 
    var index=$scope.scenari.indexOf(item);
    $scope.scenari.splice(index,1);     
  };

  $scope.editScenario = function(item){ 
    $scope.newScenario = $scope.scenari[$scope.scenari.indexOf(item)];
    $scope.remove(item);
  };
  
  $scope.executeScenario = function(item){ 
	  var actions = $scope.scenari[$scope.scenari.indexOf(item)].actions;
	  var i, timing = 0 ;
	  for(i=0 ; i < actions.length ; i++){
		var action = actions[i];
console.log('dehors : '+action.type+' value : '+action.value+' id : '+action.id);			
		  timing += timingSleep;
		  $timeout(function(){
			  
			  
			  
			  // TODO : le action même s'il est passé en paramétre retourne toujours la derniere valeur de action, même si l'on essaye de cloner la variable à son envoi 
			  
			  
console.log('dedans : '+action.type+' value : '+action.value+' id : '+action.id);				 
/*
			  switch (action.type) {
				case 'switch':
					$scope.interrupteurSwitch(action.id, action.value); // allumage pc et son
					break;
				case 'wol':
					$scope.wol('00:21:9b:15:4b:d5');
					break;
				case 'timer':
					console.log('Attente de : '+action.value);
					break;
				case 'message':
					alert(action.value);
					break;
				case 'speak':
					$scope.speak(action);					
					break;
				}
				*/
		  }, timing, true, action);
	  }
  };

  $scope.debutDef = function(str){
    var limite = 40;
    var mess = str.description.substring(0, limite);
    if(str.description.length >= limite){
      mess = mess+'...';
    }
    
    return mess;
  };
  
  $scope.velibTestItineraire = function(departs, arrivees){
	  var departPossible = false;
	  var arriveePossible = false;
	  
	  angular.foreach(departs, function(numDepart){
		  var depart = $scope.velibLoadInfos(numDepart);
		  if(depart.status=='OPEN' && depart.available_bikes >= 1){
			  departPossible = true;
			  breaks;
		  }
	  });
	  angular.foreach(arrivees, function(numArrivee){
		  var arrivee = $scope.velibLoadInfos(numArrivee);
		  if(arrivee.status=='OPEN' && arrivee.available_bike_stands >= 1){
			  arriveePossible = true;
			  breaks;
		  }
	  });
	  
	  if(false == departPossible){
		  return {'result': false, 'message':"Aucune stations de départ n'est disponible"};
	  }else if(false == arriveePossible){
		  return {'result': false, 'message':"Aucune stations d'arrivée n'est disponible"};
	  }else{
		  return {'result': true, 'message':"Trajet possible entre "+depart.name+" et "+arrivee.name+", "+depart.available_bikes+" velib sont disponible pour "+arrivee.available_bike_stands+" bornes."};
	  }
  };
  
  $scope.velibTrajetTaf = function(){
	  console.log($scope.velib);
	  var retour = $scope.velibTestItineraire();
	  
	  alert(retour.result+" - "+retour.message);
  };
  
});