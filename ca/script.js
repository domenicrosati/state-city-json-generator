/**
 * Created by sshao on 8/2/2016.
 * Data Source: https://github.com/ravisorg/Area-Code-Geolocation-Database/blob/master/ca-area-code-cities.csv
 */

var fs = require('fs')
  , csvstreamer = require('csv-streamer')
  , jsonfile = require('jsonfile');

var CSV_FILE = 'calist.csv'
  , JSON_FILE = 'ca.json';

var csv = new csvstreamer({headers:false, delimiter:','});

var object = {};
object.states = [];

var states = {};


csv.on('data', function(line){
  var state = line[2]
    , city = line[1];

  if(!states[state]){
    states[state] = {};
    states[state].name = state;
    states[state].cities = [];
  }
  states[state].cities.push(city);
});

csv.on('end', function(){
  for(var state in states){
    states[state].cities = states[state].cities.sort();
    object.states.push(states[state]);
  }
  object.states.sort(function(a, b){
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  jsonfile.writeFileSync(JSON_FILE, object, {spaces:2})
});

fs.createReadStream(CSV_FILE).pipe(csv);