// Sets the information to select a Morty from the form to hidden as default
$(document).ready( 
    function () {
        document.getElementById('mortyInfo').style.display='none';
        document.getElementById('mortyType').style.display="none";
}); 

function showfield(name){

    if (name == '0') { // Display sections to input information for a new Morty
        document.getElementById('mortyInfo').style.display="block";
        document.getElementById('mortyType').style.display="none";
    }
    else if (name == '-1'){ // Don't display any information
        document.getElementById('mortyInfo').style.display="none";
        document.getElementById('mortyType').style.display="none";
    }
    else { // Display Morty Information
        addInfo(name);
        document.getElementById('mortyType').style.display="block";
        document.getElementById('mortyInfo').style.display="none";
    }
}

// Prepend the select option for a morty to a blank selection and set value to -1 
$("#selectMortyOption").prepend("<option value='-1' selected='selected'></option>");

function addInfo (select_id) {
    var req = new XMLHttpRequest();

	req.open('GET', "/mortyInfo", true);

	req.addEventListener('load',function(){ 
		if(req.status >= 200 && req.status < 400){
            
	    	let response = JSON.parse(req.responseText);
            let length = response.morty.length;
            let morty_id, morty_fName, morty_lName, morty_health, morty_level, morty_defense;
             
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

            // Open new request to obtain the different attacks that a morty has
            var newReq = new XMLHttpRequest();   

            newReq.open('Get', "mortyAttacks?id=" + morty_id, true);
            newReq.addEventListener('load',function(){ if(newReq.status >= 200 && newReq.status < 400){
                let attacks = JSON.parse(newReq.responseText);
                
                // Call function to create card that presents all of morty's info
                displaySelectedMorty(morty_fName, morty_lName, morty_health, morty_level, morty_defense, attacks);
                
              }
              else {
                console.log("Error in network request: " + newReq.statusText);
              }});
    
              newReq.send(null);

	    }
	    else {
	    	console.log("Error in network request: " + req.statusText);
	    }});

	req.send(null);
}

// Display a card with the morty's data
// Level, health, defense, attack, and their power
function displaySelectedMorty(fName, lName, health, level, defense, attacks){
    divContent = document.getElementById("mortyType");

    // If card already exists then delete it and replace it with an updated card
    if (document.getElementById("morty_status"))
        document.getElementById("morty_status").remove();

    // Create Card div
    let newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.setAttribute("id", "morty_status");
    newCard.setAttribute("style", "width: 35rem;");

    // Create card header div
    let headerCard = document.createElement("div");
    headerCard.setAttribute("class", "card-header");

    // Create header of the Morty
    let header = document.createElement("h4");
    header.textContent = fName + " " + lName;

    // Create Table
    let table = document.createElement("table");
    table.setAttribute("class", "table table-inverse");
    let tableHead = document.createElement("thead");
    let tableRow = document.createElement("tr");

    // Create table header for level
    let tableHeader2 = document.createElement("th");
    tableHeader2.textContent = "Level";
    tableRow.appendChild(tableHeader2);

    // Create table header for Health
    let tableHeader1 = document.createElement("th");
    tableHeader1.textContent = "Health";
    tableRow.appendChild(tableHeader1);

    // Create table header for Defense
    let tableHeader3 = document.createElement("th");
    tableHeader3.textContent = "Defense";
    tableRow.appendChild(tableHeader3);

    // Create table header for Attack
    let tableHeader4 = document.createElement("th");
    tableHeader4.textContent = "Attack(s)";
    tableRow.appendChild(tableHeader4);

    // Create table header for Power
    let tableHeader5 = document.createElement("th");
    tableHeader5.textContent = "Power";
    tableRow.appendChild(tableHeader5);

    // Link table header to table
    tableHead.appendChild(tableRow);
    table.appendChild(tableHead);

    // create table body to display data
    let tableBody = document.createElement("tbody");

    let newTableRow = document.createElement("tr");
    let tableData = document.createElement("td");
    tableData.textContent = level;
    newTableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.textContent = health;
    newTableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.textContent = defense;
    newTableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.textContent = attacks[0].ability;
    newTableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.textContent = attacks[0].power;
    newTableRow.appendChild(tableData);

    table.appendChild(newTableRow);

    // Add any additional attack and their power
    let length = attacks.length; 
    for (let i = 1; i < length; i++) {
        newTableRow = document.createElement("tr");

        tableData = document.createElement("td");
        tableData.setAttribute("colspan", "3");
        newTableRow.appendChild(tableData);

        tableData = document.createElement("td");
        tableData.textContent = attacks[i].ability;
        newTableRow.appendChild(tableData);

        tableData = document.createElement("td");
        tableData.textContent = attacks[i].power;
        newTableRow.appendChild(tableData);

        table.appendChild(newTableRow);
    }

    // Link table into the card
    headerCard.appendChild(header);
    newCard.appendChild(headerCard);
    newCard.appendChild(table);
    divContent.appendChild(newCard);
}

