$(document).ready( 
    function () {
        document.getElementById('mortyInfo').style.display='none';
        document.getElementById('mortyType').style.display="none";
}); 

function showfield(name){
    if (name=='0') {
        document.getElementById('mortyInfo').style.display="block";
        document.getElementById('mortyType').style.display="none";
    }
    else if (name=='-1'){
        document.getElementById('mortyInfo').style.display="none";
        document.getElementById('mortyType').style.display="none";
    }
    else {
        document.getElementById('mortyInfo').style.display="none";
        document.getElementById('mortyType').style.display="block";
    }
}
 
$("#selectMortyOption").prepend("<option value='-1' selected='selected'></option>");