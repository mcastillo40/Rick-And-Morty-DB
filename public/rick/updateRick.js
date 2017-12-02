document.addEventListener('DOMContentLoaded', updateFields);
document.addEventListener('DOMContentLoaded', getMortys);

/*function updatePerson(id){
    $.ajax({
        url: '/' + id,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};*/


// Ensures that the default selection is choosen
function updateFields() {
    let dimension = document.getElementById("DimensionID").value;
    let type = document.getElementById("typeID").value;
    
    $("#type-selector").val(type);
    $("#dimension-selector").val(dimension);
}

// Get which morty's the rick is linked to 
function getMortys() {
    let rickID = document.getElementById("rickID").value; 

    var req = new XMLHttpRequest();

    req.open('GET', "/ricksMortys?id=" + rickID, true);

    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {

            let response = JSON.parse(req.responseText);
            let length = response.length; // The number of morty's the select Rick captured
            let checkBoxID, updateChecked, prevMortyCheckbox;

            // Sets the morty's to checked in the update page for a rick
            for (let i = 0; i < length; i++) {
                checkBoxID = response[i].fname + response[i].morty_id;
                updateChecked = document.getElementById(checkBoxID);
                updateChecked.setAttribute("checked", "true");

                prevMortyCheckbox = response[i].fname + "-" + response[i].morty_id;
                updateChecked = document.getElementById(prevMortyCheckbox);
                updateChecked.setAttribute("checked", "true");
            }

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.send(null);
}