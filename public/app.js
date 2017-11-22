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
        document.getElementById('mortyType').style.display="block";
        document.getElementById('mortyInfo').style.display="none";
    }
}

// Prepend the select option for a morty to a blank selection and set value to -1 
$("#selectMortyOption").prepend("<option value='-1' selected='selected'></option>");