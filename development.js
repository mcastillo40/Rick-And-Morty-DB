module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getUniverse(res, mysql, context, complete){
        mysql.pool.query("SELECT universe_id, name FROM universe", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.dimension  = results;
            complete();
        });
    }

    function getType(res, mysql, context, complete){
        mysql.pool.query("SELECT rick_type_id, type FROM rick_type", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.type  = results;
            complete();
        });
    }

    function getRicks(res, mysql, context, complete){
        mysql.pool.query("SELECT rick.rick_id, fname, lname, level, universe.name AS dimension, rick_type.type AS type "
            + "FROM rick INNER JOIN universe ON dimension = universe.universe_id " 
            + "INNER JOIN rick_type ON rick.type = rick_type.rick_type_id", 
        function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ricks = results;
            complete();
        });
    }

    function getRicksMortys(res, mysql, context, complete){
        mysql.pool.query("SELECT rick.rick_id AS rickID, morty.fName, morty.lName FROM rick_mortys "
            + "INNER JOIN morty ON rick_mortys.m_id = morty.morty_id "
            + "INNER JOIN rick ON rick_mortys.r_id = rick.rick_id", 
        function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rick_catches = results;
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getRicks(res, mysql, context, complete);
        getUniverse(res, mysql, context, complete);
        getType(res, mysql, context, complete);
        getRicksMortys(res, mysql, context, complete);
        function complete(){
            // Increase callbackCount everytime function was called
            // Render page after everything was completed
            callbackCount++; 

            if(callbackCount >= 4){

                console.log(context);

                res.render('home', context);
            }

        }
    });

    return router;
}();