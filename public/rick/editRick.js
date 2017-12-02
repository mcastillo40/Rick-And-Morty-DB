document.addEventListener('DOMContentLoaded', getRick);

// Sets the information to select a Morty from the form to hidden as default
$(document).ready(
    function () {
        document.getElementById('mortyInfo').style.display = 'none';
        document.getElementById('mortyType').style.display = "none";
    });

// Will Display the appropriate information for a morty selection in the form
function showfield(name) {
    if (name == '0') { // Display sections to input information for a new Morty
        document.getElementById('mortyInfo').style.display = "block";
        document.getElementById('mortyType').style.display = "none";
    } else if (name == '-1') { // Don't display any information
        document.getElementById('mortyInfo').style.display = "none";
        document.getElementById('mortyType').style.display = "none";
    } else { // Display Morty Information
        document.getElementById('mortyType').style.display = "block";
        document.getElementById('mortyInfo').style.display = "none";
        addMortyInfo(name);
    }
}

// Prepend the select option for a morty to a blank selection and set value to -1 
$("#selectMortyOption").prepend("<option value='-1' selected='selected'></option>");

// Function that requests information from the morty table
// Will loop through list to find the morty information to display to the user
function addMortyInfo(select_id) {
    let morty_id, morty_fName, morty_lName, morty_health, morty_level, morty_defense;
    var req = new XMLHttpRequest();

    req.open('GET', "/mortyInfo", true);

    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {

            let response = JSON.parse(req.responseText);
            let length = response.morty.length;

            for (var i = 0; i < length; i++) {
                if (select_id == response.morty[i].morty_id) {
                    morty_id = response.morty[i].morty_id;
                    morty_fName = response.morty[i].fname;
                    morty_lName = response.morty[i].lname;
                    morty_health = response.morty[i].health;
                    morty_level = response.morty[i].level;
                    morty_defense = response.morty[i].defense;
                }
            }

            // Call function to obtain the attacks of the morty called
            addAttackInfo(morty_id, morty_fName, morty_lName, morty_health, morty_level, morty_defense);

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.send(null);

}

// This function calls to receive the different attacks that a specific morty contains
function addAttackInfo(morty_id, morty_fName, morty_lName, morty_health, morty_level, morty_defense) {

    // Open new request to obtain the different attacks that a morty contains
    var newReq = new XMLHttpRequest();

    newReq.open('Get', "mortyAttacks?id=" + morty_id, true);
    newReq.addEventListener('load', function () {
        if (newReq.status >= 200 && newReq.status < 400) {
            let attacks = JSON.parse(newReq.responseText);

            // Call function to create card that presents all of morty's info
            displaySelectedMorty(morty_fName, morty_lName, morty_health, morty_level, morty_defense, attacks);

        } else {
            console.log("Error in network request: " + newReq.statusText);
        }
    });

    newReq.send(null);
}


function getRick() {

    // Open new request to obtain the different attacks that a morty contains
    var newReq = new XMLHttpRequest();

    newReq.open('Get', "/getRickInfo", true);
    newReq.addEventListener('load', function () {
        if (newReq.status >= 200 && newReq.status < 400) {

            let response = JSON.parse(newReq.responseText);

            let length = response.ricks.length; // The number of Ricks in the database
            let rickID;

            for (let i = 0; i < length; i++) {
                rickID = response.ricks[i].rick_id;
                getRicksMortys(rickID);
            }

        } else {
            console.log("Error in network request: " + newReq.statusText);
        }
    });

    newReq.send(null);
}

// This function calls to receive the different morty's that a specific Rick contains
function getRicksMortys(rickID){
    let rickSection = document.getElementById(rickID);

    var req = new XMLHttpRequest();
    
    req.open('GET', "/ricksMortys?id=" + rickID, true);

    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {

            let response = JSON.parse(req.responseText);
            let length = response.length; // The number of morty's the select Rick captured
            let mortyID, fNmae, lName, lvl, health, def;

            for (let i = 0; i < length; i++) {
                mortyID = response[i].morty_id;
                fNmae = response[i].fname;
                lName = response[i].lname;
                lvl = response[i].level;
                health = response[i].health;
                def = response[i].defense;
                createMortyInfo(rickSection, mortyID, fNmae, lName, lvl, health, def);
            }

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.send(null);
    
}


function updateRick(rickID) {
    window.location.href = "/update/" + rickID;
}


