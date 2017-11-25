// Display a card with the morty's data
// Level, health, defense, attack, and their power
function displaySelectedMorty(fName, lName, health, level, defense, attacks) {
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

// Function displays the morty's for a specific Rick 
function createMortyInfo(rickSection, mortyID, fName, lName, lvl, health, def) {
    
    let attack = document.createElement("p");
    attack.textContent = "NAME: " + fName + " " + lName;
    attack.textContent += " LEVEL: " + lvl;
    attack.textContent += " HEALTH: " + health;
    attack.textContent += " DEFENSE: " + def;

    rickSection.appendChild(attack);
}