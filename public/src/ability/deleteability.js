function deleteAbility(id){

    let payload = {"attack_id" : id}

    var req = new XMLHttpRequest();
    
    req.open('POST', "/deleteAbility?attack_id=" + id, true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {

            // Reload page after Attack type is deleted
            window.location.reload(true);
            
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    
    req.send(JSON.stringify(payload));
};
    