var request = require('request');
var colors = require('colors');

var path = require('path');
var exec = require('child_process').exec;

function help() {
  console.log(process.argv[1] + ' [checkInterval]');
  console.log('\tcheckInterval -- check interval in seconds (example: 5)');
}

if (process.argv.length == 3 && process.argv[2].indexOf('help') > -1) {
  help();
  return;
}

//Base configuration
var appDir = path.dirname(require.main.filename);
var stockKeyword = "We are out of inventory";
var notAvailableKeyword = "is not available";
var audioPlayBinary = "afplay";
var checkInterval = process.argv[2] * 1000 || 1000; //Check EVERY device every 2 seconds

var playUrl = [
	/*{
		url: 'https://play.google.com/store/devices/details?id=nexus_6_blue_32gb&hl=en',
		name: 'Nexus 6 Blue 32GB'
	},
	{
		url: 'https://play.google.com/store/devices/details/Nexus_6_32GB_Cloud_White?id=nexus_6_white_32gb&hl=en',
		name: 'Nexus 6 White 32GB'
	},*/
	/*{
		url: 'https://play.google.com/store/devices/details/Nexus_6_64GB_Midnight_Blue?id=nexus_6_blue_64gb&hl=en',
		name: 'Nexus 6 Blue 64GB'
	},*/
	{
		url: 'https://play.google.com/store/devices/details/Nexus_6_64GB_Cloud_White?id=nexus_6_white_64gb&hl=en',
		name: 'Nexus 6 White 64GB'
	}
];

//GET ME MY NEXUS 6!!!
doCheck();
playAlert(); //Just to make sure alert works when launching

function doCheck() {
	var now = new Date();
	var date = now.getMonth() + 1 + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " ";

	var fs = require('fs');

	Object.keys(playUrl).forEach(function(key){
		var itemToCheck = playUrl[key];

		request(itemToCheck.url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				if (body.indexOf(stockKeyword) > -1 || body.indexOf(notAvailableKeyword) > -1) {
					console.log(date + "Out of stock or unavailable: ".red + itemToCheck.name.red);
        } else {
					playAlert();
					console.log(date + "In stock: ".bold.green + itemToCheck.name.green + ", ".green + itemToCheck.url.underline.green);
					fs.appendFile('log.txt', date + '\t' + itemToCheck.name + '\n');
				}
			}else{
				console.log(date + "Unknown error.  WTF MAN?!?");
			}
		})
	});

	setTimeout(doCheck, checkInterval);
}

function playAlert() {
	exec(audioPlayBinary + " " + appDir + "/chime.mp3");
}
