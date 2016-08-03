/**
 * Created by sshao on 8/2/2016.
 * Data Source: http://pmatsinopoulos.github.io/blog/2014/08/29/united-states-counties-cities-csv-ruby-loading-code/
 */

var fs = require('fs')
  , csvstreamer = require('csv-streamer')
  , jsonfile = require('jsonfile');

var CSV_CITIES_FILE = 'cities.csv'
  , CSV_STATES_FILE = 'states.csv'
  , JSON_FILE = 'us.json';

var csv = new csvstreamer({headers:false, delimiter:','});

var object = {};
object.states = [];

var states = {}
  , abbvHash = {};

var parseCitiesStarted = false;

csv.on('data', function(line){
  //Parse states.csv
  if(line.length === 2){
    var abbv = line[0]
      , state = line[1];
    abbvHash[abbv] = state;
  }
  //Parse cities.csv
  else if(line.length === 3){
    var abbv = line[0]
      , city = line[2]
      , state = abbvHash[abbv];

    if(!parseCitiesStarted){
      parseCitiesStarted = true;
    }

    if(!states[state]){
      states[state] = {};
      states[state].abbreviation = abbv;
      states[state].name = state;
      states[state].cities = [];
    }
    states[state].cities.push(city);
  }
});

csv.on('end', function(){
  //Parsed states.csv
  if(!parseCitiesStarted){
    fs.createReadStream(CSV_CITIES_FILE).pipe(csv);
  }
  //Parsed cities.csv
  else{
    for(var state in states){
      states[state].cities = states[state].cities.sort();
      object.states.push(states[state]);
    }
    object.states.sort(function(a, b){
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    jsonfile.writeFileSync(JSON_FILE, object, {spaces:2})
  }
});

fs.createReadStream(CSV_STATES_FILE).pipe(csv);