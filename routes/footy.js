//var request = require('request-promise')
const express = require('express')
const router = express.Router()
const axios = require('axios');

//Website https://the-odds-api.com/

//API key variable
const API_key = 'd036db9ab72e5b4aa433ced35b623998'

//URL declaration
const baseURL = 'https://api.the-odds-api.com/v3/odds?'
//const apikey = 'apiKey=' + API_key
//const sport = '&sport=americanfootball_nfl'


//function to get max index from array
function indexOfMax(arr) {
    if (arr.length === 0) {
        return false;
    }

    var max = arr[0];

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    return max;
}

//function to get min index from array
function indexOfMin(arr) {
    if (arr.length === 0) {
        return false;
    }

    var min = arr[0];

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }

    return min;
}

var highest_home_odds_index
                var highest_away_odds_index

                var lowest_home_odds_index
                var lowest_away_odds_index

//Can replace with these:
//mma_mixed_martial_arts
//americanfootball_ncaaf
//americanfootball_nfl

//const region = '&region=au'
//const market = '&mkt=h2h'
//const dateFormat = '&dateFormat=iso'
//const url = baseURL + apikey + sport + region + market + dateFormat
async function retrieveEventDetails() {
    return new Promise((resolve, reject) => {
        axios.get(baseURL, {
            params: {
                api_key: API_key,
                sport: "americanfootball_nfl",
                region: "au",
                mkt: "h2h",
                dateFormat: "unix"
            }
        }).then(response => {
            // odds_json['data'] contains a list of live and 
            //   upcoming events and odds for different bookmakers.
            // Events are ordered by start time (live events are first)
            console.log(
                `Successfully got ${response.data.data.length} events`,
                `Here are all the events:`
            )
            var eventData = JSON.stringify(response.data.data)
            var events = new Array(response.data.data.length)

            console.log(eventData)

            for (var i = 0; i < response.data.data.length; i++) {
                console.log()
                console.log(response.data.data[i].teams)
                var sites_no = response.data.data[i].sites_count
                console.log(sites_no + " current sites available")

                events[i] = new Array(5)
                events[i][0] = response.data.data[i].teams[0] // Home team
                events[i][1] = response.data.data[i].teams[1] // Away team

                //Unix formatted event date
                var Unix_commence_time = response.data.data[i].commence_time * 1000

                //Convert to nice date
                var dateObject = new Date(Unix_commence_time)
                var commence_time = dateObject.toLocaleString("en-AU")

                events[i][2] = commence_time //Event date

                //Declare length of empty array for different sites
                events[i][3] = new Array(sites_no)

                for (var j = 0; j < sites_no; j++) { //sites
                    console.log(response.data.data[i].sites[j].site_nice)
                    console.log(response.data.data[i].sites[j].odds.h2h)

                    events[i][3][j] = new Array(8)

                    //Place Site and team data into array

                    events[i][3][j][0] = response.data.data[i].sites[j].site_nice //Betting site
                    events[i][3][j][1] = response.data.data[i].sites[j].odds.h2h[0] // Home team odds
                    events[i][3][j][2] = response.data.data[i].sites[j].odds.h2h[1] // Away team odds

                    //Unix formatted start date
                    var Unix_start_time = response.data.data[i].sites[j].last_update * 1000

                    //Convert to nice date
                    var dateObjectStartTime = new Date(Unix_start_time)
                    var start_time = dateObjectStartTime.toLocaleString("en-AU")

                    events[i][3][j][3] = start_time //Last updated

                    
                }

                //Defining highest and lowest odds offered
                var home_team_odds = new Array(sites_no)
                var away_team_odds = new Array(sites_no)

                //Put odds into arrays
                for (var k = 0; k < sites_no; k++) {


                    //home team odds
                    home_team_odds[k] = events[i][3][k][1]

                    //away team odds
                    away_team_odds[k] = events[i][3][k][2]

                }
    


                var highest_home_odds_index = indexOfMax(home_team_odds)
                var highest_away_odds_index = indexOfMax(away_team_odds)

                var lowest_home_odds_index = indexOfMin(home_team_odds)
                var lowest_away_odds_index = indexOfMin(away_team_odds)

                // console.log(highest_home_odds_index)
                // console.log(lowest_home_odds_index)

                events[i][4] = new Array(4)

                //1 = highest home team
                events[i][4][0] = highest_home_odds_index

                //2 = lowest home team
                events[i][4][1] = lowest_home_odds_index

                //3 = highest away team
                events[i][4][2] = highest_away_odds_index

                //4 = lowest away team
                events[i][4][3] = lowest_away_odds_index


                console.log(highest_home_odds_index)
                console.log(lowest_home_odds_index)
                console.log(highest_away_odds_index)
                console.log(lowest_away_odds_index)
            }


            // Check your usage
            console.log()
            console.log('Remaining requests', response.headers['x-requests-remaining'])
            console.log('Used requests', response.headers['x-requests-used'])
            resolve(events)
        })
            .catch(error => {
                reject("odds api error")
                console.log('Error status', error.response.status)
                console.log(error.response.data)
            })
    })
}

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        const events = await retrieveEventDetails()
        res.render('index', { events,
        highest_home: highest_home_odds_index,
        lowest_home: lowest_home_odds_index,
        highest_away: highest_away_odds_index,
        lowest_away: lowest_away_odds_index,
        });
        console.log('Rendered the home page')
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;