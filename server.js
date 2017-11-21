var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var app = express();

app.set('mysql', mysql);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.engine('handlebars', handlebars.engine);

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));

app.use('/people', require('./development.js'));

//app.get('/',function(req,res,next){ 
//    res.render('home');
//}); 

app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
  
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});