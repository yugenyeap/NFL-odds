const boxrec = require("boxrec").Boxrec
const express = require('express');
const router = express.Router();

//Boxrec login details
BOXREC_USERNAME = 'gazzamayte';
BOXREC_PASSWORD = 'dueb58nthw78,;;';
var cookieJar;

//Logs into boxrec site
async function Login() {
    try {
        cookieJar = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD)
        console.log("Logged into BoxRec")
        // successfully logged in
    } catch (e) {
        // error occurred logging in
        console.log('Error logging in')
    }
};

//Separates the name given in odds API
function separateName(nameInput) {
    var splitname = nameInput.split(" ")
    var array = splitname;
    array[1] = array[1].slice(0, 1); //get rid of the "." in the name
    return array
};

//Gets just the date from the OSI date format
function filterDate(dateInput) {
    var filteredDate = dateInput.split("T");
    var res = filteredDate[0]
    return res;
}

//Retrieves boxer object from BoxRec
async function GetboxerInfo(inputName, fightDate) {
    await Login();
    let fullname = separateName(inputName);
    try {
        const searchResults = await boxrec.search(cookieJar, {
            first_name: fullname[1],
            last_name: fullname[0],
            role: "proboxer",
            status: "a"
        });
        for (i = 0; i < searchResults.length; i++) {
            temporaryID = searchResults[i].id //get boxer ID

            //Get boxer information
            const tempboxer = await boxrec.getPersonById(cookieJar, temporaryID);

            //Search next boxer if boxer does not have a bout scheduled
            if (!tempboxer.hasBoutScheduled) {
                continue;
            }

            //Get boxer's upcoming fight date from boxrec API
            var upcomingBoutNumber = tempboxer.bouts.length - 1;
            var upcomingBoutDate = tempboxer.bouts[upcomingBoutNumber].date

            //Get just the date
            var eventDate = filterDate(fightDate)

            //Create new date variable to account for US time difference
            let modifiedDate = new Date(eventDate);
            modifiedDate = new Date(modifiedDate - 864e5); //Minus a day from the original date given
            let USDate = modifiedDate.toISOString();
            var USeventDate = filterDate(USDate)

            //Check if Boxrec and odds API date match, if so retrieve and return the boxer's statistics
            if (upcomingBoutDate === eventDate || upcomingBoutDate === USeventDate) {
                BoxerID = searchResults[i].id;
                const boxer = await boxrec.getPersonById(cookieJar, BoxerID);
                console.log("Retrieved Profile from BoxRec")
                return boxer
            }
        }
    }
    catch (boxrecError) {
      console.log("Could not find boxer on boxrec")
      console.log(boxrecError)
    }
};

/* GET info page. */
router.get('/', async function (req, res) {
    try {
      boxer = req.query.boxer
      date = req.query.date
        const info = await GetboxerInfo(boxer, date);
        res.render('info', { info });
        console.log('Rendered the boxer profile')
    }
    catch(err) {
        console.log(err);
    }
})

module.exports = router;
