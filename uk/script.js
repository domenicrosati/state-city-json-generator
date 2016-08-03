/**
 * Created by sshao on 8/2/2016.
 * Data Source: http://www.paulstenning.com/uk-towns-and-counties-list/
 */

var fs = require('fs')
  , csvstreamer = require('csv-streamer')
  , jsonfile = require('jsonfile');

var CSV_FILE = 'uklist.csv'
  , JSON_FILE = 'uk.json';

var csv = new csvstreamer({headers:true, delimiter:','});

var object = {};
object.regions = [];

var regions = {}
  , counties = {};


csv.on('data', function(line){
  var country = line.Country
    , county = line.County
    , town = line.Town;

  if(!counties[county]){
    counties[county] = {};
    counties[county].name = county;
    counties[county].cities = [];
  }
  counties[county].cities.push(town);

  if(!regions[country]){
    regions[country] = {};
    regions[country].name = country;
    regions[country].states = [];
  }

  if(!regions[country].states.length){
    regions[country].states.push(counties[county]);
  }
  else{
    for(var i = 0; i < regions[country].states.length; i++){
      if(regions[country].states[i].name === county){
        regions[country].states[i].cities = counties[county].cities;
      }
      else if(i === regions[country].states.length - 1 && regions[country].states[i].name !== county){
        regions[country].states.push(counties[county]);
      }
    }
  }
});

csv.on('end', function(){
  for(var region in regions){
    object.regions.push(regions[region]);
  }
  jsonfile.writeFileSync(JSON_FILE, object, {spaces:2})
});

fs.createReadStream(CSV_FILE).pipe(csv);