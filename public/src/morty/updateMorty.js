document.addEventListener('DOMContentLoaded', getMortys);

// Get which morty's the rick is linked to 
function getMortys() {
    let mortyID = document.getElementById("mortyID").value; 

    var req = new XMLHttpRequest();

    req.open('GET', "/mortyAttacks?id=" + mortyID, true);

    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {

            let response = JSON.parse(req.responseText);
            let length = response.length; // The number of morty's the select Rick captured
            let currentCheckBoxID, updateChecked, prevCheckbox;

            console.log(response);

            // Sets the morty's to checked in the update page for a rick
            for (let i = 0; i < length; i++) {
                currentCheckBoxID = response[i].ability + response[i].attack_id;
                updateChecked = document.getElementById(currentCheckBoxID);
                updateChecked.setAttribute("checked", "true");

                prevCheckbox = response[i].ability + "-" + response[i].attack_id;
                updateChecked = document.getElementById(prevCheckbox);
                updateChecked.setAttribute("checked", "true");
            }

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.send(null);
}