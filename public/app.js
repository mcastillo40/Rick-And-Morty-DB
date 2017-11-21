$(document).ready( 
    function () {
        document.getElementById('mortyInfo').style.display='none';
}); 

function showfield(name){
    if(name=='Other')document.getElementById('mortyInfo').style.display="block";
    else document.getElementById('mortyInfo').style.display="none";
}
 
$("#selectMortyOption").prepend("<option value='0' selected='selected'></option>");