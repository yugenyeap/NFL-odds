var request = require('request-promise-native')
const express = require('express');
const router = express.Router();

//Website https://app.oddsapi.io/

//API key variable
const API_key = 'ad4f6d70-c27f-11e9-90c5-d70066f27333'

//URL declaration
const baseURL = 'https://api.the-odds-api.com/v3/odds?'
const input = 'sport=boxing&apikey=' + API_key
const url = baseURL + input


//Querys Odds API returning fighter names, date and odds
async function getAllEventDetails() {
    return new Promise((resolve, reject) => {
        request(url)
            .then(function (result) {
                var data = JSON.parse(result)
                var events = new Array();
                for (i = 0; i < data.length; i++) {
                    events[i] = new Array(7)

                    //get event data
                    events[i][0] = data[i].event

                    //Get odds for betFair site
                    try {
                        events[i][1] = data[i].sites["1x2"].betfair.odds
                    } catch {
                        events[i][1] = new Array(3)
                        events[i][1][0] = "No odds listed"
                        events[i][1][1] = "No odds listed"
                        events[i][1][2] = "No odds listed"
                    }

                    //betfred
                    try {
                        events[i][2] = data[i].sites["1x2"].betfred.odds
                    } catch {
                        events[i][2] = new Array(3)
                        events[i][2][0] = "No odds listed"
                        events[i][2][1] = "No odds listed"
                        events[i][2][2] = "No odds listed"
                    }

                    //betway
                    try {
                        events[i][3] = data[i].sites["1x2"].betway.odds
                    } catch {
                        events[i][3] = new Array(3)
                        events[i][3][0] = "No odds listed"
                        events[i][3][1] = "No odds listed"
                        events[i][3][2] = "No odds listed"
                    }

                    //coolbet
                    try {
                        events[i][4] = data[i].sites["1x2"].coolbet.odds
                    } catch {
                        events[i][4] = new Array(3)
                        events[i][4][0] = "No odds listed"
                        events[i][4][1] = "No odds listed"
                        events[i][4][2] = "No odds listed"
                    }

                    //come on
                    try {
                        events[i][5] = data[i].sites["1x2"].comeon.odds
                    } catch {
                        events[i][5] = new Array(3)
                        events[i][5][0] = "No odds listed"
                        events[i][5][1] = "No odds listed"
                        events[i][5][2] = "No odds listed"
                    }

                     //marathon bet
                     try {
                        events[i][6] = data[i].sites["1x2"].marathonbet.odds
                    } catch {
                        events[i][6] = new Array(3)
                        events[i][6][0] = "No odds listed"
                        events[i][6][1] = "No odds listed"
                        events[i][6][2] = "No odds listed"
                    }
                }
                console.log("Retrieved data from Odds API")
                resolve(events);
            })
            .catch(function (error) {
                reject('odds api error')
                console.log("Odds api request failed")
            })
    })
}

//Place Information in nice array
async function getfighters() {
    try {
        var events = await getAllEventDetails();
        var Fighters = new Array(events.length);
        for (i = 0; i < events.length; i++) {
            Fighters[i] = new Array(9);
            Fighters[i][0] = events[i][0].home; //Put home fighter in array
            Fighters[i][1] = events[i][0].away; //Put away fighter in array
            var date = events[i][0].start_time; 
            Fighters[i][2] = filterDate(date); //Put just the date in the array
            
            //Put odds in array
            Fighters[i][3] = events[i][1];
            Fighters[i][4] = events[i][2];
            Fighters[i][5] = events[i][3];
            Fighters[i][6] = events[i][4];
            Fighters[i][7] = events[i][5];
            Fighters[i][8] = events[i][6];

            //Put start time in array
            Fighters[i][9] = date;        
            
            
        }
        return (Fighters);
    } catch (e) {
        console.log('Error getting fighters')
    }
}

//Gets just the date from the OSI date format
function filterDate(dateInput) {
    var filteredDate = dateInput.split("T");
    var res = filteredDate[0]
    return res;
}

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        const events = await getfighters()
        res.render('index', { events });
        console.log('Rendered the home page')
    }
    catch(err) {
        console.log(err);
    }
})


module.exports = router;