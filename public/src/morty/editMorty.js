document.addEventListener('DOMContentLoaded', setPage);
document.addEventListener('DOMContentLoaded', addMortyInfo);

// Set nav section to active
function setPage() {
    let currentPage = document.getElementById('mortyPage');
    currentPage.setAttribute("class", "active");
}

// Function that requests information from the morty table
// Will loop through list to find the morty information to display to the user
function addMortyInfo() {
    let morty_id, morty_fName, morty_lName, morty_health, morty_level, morty_defense;
    var req = new XMLHttpRequest();

    req.open('GET', "/mortyInfo", true);

    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {

            let response = JSON.parse(req.responseText);
            let length = response.morty.length;
            
            //  Iterate through morty's to get id and add attack for the specific morty
            for (var i = 0; i < length; i++) 
              addAttackInfo(response.morty[i].morty_id);

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.send(null);

}

// This function calls to receive the different attacks that a specific morty contains
function addAttackInfo(morty_id) {

    let mortySection = document.getElementById(morty_id);
  
    var newReq = new XMLHttpRequest();

    newReq.open('Get', "mortyAttacks?id=" + morty_id, true);
    newReq.addEventListener('load', function () {
        if (newReq.status >= 200 && newReq.status < 400) {
            let attacks = JSON.parse(newReq.responseText);

            // Input the different attack names and power into each morty card
            for (let i = 0; i < attacks.length; i++)
                displayMortyAttack(mortySection, attacks[i].ability, attacks[i].power);

        } else {
            console.log("Error in network request: " + newReq.statusText);
        }
    });

    newReq.send(null);
}


function updateMorty(mortyID) {
    window.location.href = "/updateMorty/" + mortyID;
}


