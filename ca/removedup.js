/**
 * Created by sshao on 8/2/2016.
 * Data Source: https://github.com/ravisorg/Area-Code-Geolocation-Database/blob/master/ca-area-code-cities.csv *
 */

var fs = require('fs')
  , jsonfile = require('jsonfile');

var JSON_FILE = 'ca-dup.json'
  , NEW_JSON_FILE = 'ca.json';

jsonfile.readFile(JSON_FILE, function(err, data){
  if(err){
    console.error('ERROR: jsonfile.readFile');
    return;
  }
  var states = data.states;
  states.forEach(function(state){
    var cities = state.cities;
    var newcities = [];
    var hash = {};
    for(var i = 0; i < cities.length; i++){
      var city = cities[i];
      if(!hash[city]){
        hash[city] = true;
        newcities.push(city);
      }
    }
    state.cities = newcities;
  });
  jsonfile.writeFileSync(NEW_JSON_FILE, data, {spaces: 2});
});