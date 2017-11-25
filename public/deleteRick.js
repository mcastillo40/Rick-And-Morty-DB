function deleteRick(id){
    console.log("DELETE: " + id);
    $.ajax({
        url: '/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
};