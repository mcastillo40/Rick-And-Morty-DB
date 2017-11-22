module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Obtains the information for the different dimensions that a Rick can live
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

    // Obtains the Types of Ricks
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

    // Obtains the different Rick's in the database
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

    // Obtains the different Morty's in the database
    function getMortys(res, mysql, context, complete){
        mysql.pool.query("SELECT morty.morty_id, fname, lname, level, health, defense FROM morty", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.morty  = results;
            complete();
        });
    }

    // Obtains the attack type for a morty
    function getAttackType(res, mysql, context, complete){
        mysql.pool.query("SELECT attack_id, ability, power FROM attack_type", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.mAttack  = results;
            complete();
        });
    }

    // Obtains the morty's that each rick has in their possession
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

    // Gets the id for the next Rick in the list
    function getNextMaxID(res, mysql, context, complete){
        mysql.pool.query("SELECT Auto_increment AS maxID FROM information_schema.tables WHERE table_name='rick'",
        function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.lastID = results;

            complete();
        });
    }

    // Gets the id for the next Morty in the list
    function getMortyMaxID(res, mysql, context, complete){
        mysql.pool.query("SELECT Auto_increment AS maxMortyID FROM information_schema.tables WHERE table_name='morty'",
        function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.mortyLastID = results;

            complete();
        });
    }

    /* Display all Ricks. */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getRicks(res, mysql, context, complete);
        getMortys(res, mysql, context, complete);
        getUniverse(res, mysql, context, complete);
        getType(res, mysql, context, complete);
        getRicksMortys(res, mysql, context, complete);
        getNextMaxID(res, mysql, context, complete);
        getAttackType(res, mysql, context, complete);
        getMortyMaxID(res, mysql, context, complete);
        function complete(){
            // Increase callbackCount everytime function was called
            // Render page after everything was completed
            callbackCount++; 

            if(callbackCount >= 8){

                res.render('home', context);
            }

        }
    });

    /* Adds a Rick, redirects to the home page after adding */
    router.post('/', function(req, res){

        // Get Rick's basic information first
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO rick (fName, lName, level, type, dimension) VALUES (?,?,?,?,?)";
        let inserts = [req.body.fname, req.body.lname, req.body.level, req.body.type, req.body.dimension];

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{

                // Get the information from select to validate whether the user
                // wanted to add a morty
                let newSql = "INSERT INTO rick_mortys (r_id, m_id) VALUES (?, ?)";
                let newInserts = [req.body.rickID, req.body.morty];
                let firstRickID = req.body.rickID;

                if (req.body.morty != 0) { // User requested to add a pre-existing Morty

                    newSql = mysql.pool.query(newSql,newInserts,function(error, results, fields){
                        if(error){
                            res.write(JSON.stringify(error));
                            res.end();
                        }else{

                            res.redirect('/');
                        }
                    });

                }
                else if (req.body.morty == 0) { // User requested to add a new Morty
                    
                    let mortySql = "INSERT INTO morty (fName, lName, level, health, defense) VALUES (?,?,?,?,?)";
                    let mortyInserts = [req.body.mortyfName, req.body.mortylName, req.body.mortyLevel, req.body.mortyHealth, req.body.mortyDefense];

                    mortySql = mysql.pool.query(mortySql,mortyInserts,function(error, results, fields){
                        if(error){
                            res.write(JSON.stringify(error));
                            res.end();
                        }
                        else {
                            
                            let attackSql = "INSERT INTO morty_attacks (m_id, a_id) VALUES (?, ?)";
                            let attackInserts = [req.body.mortyID, req.body.mortyAttack];
                            let firstMortyID = req.body.mortyID;

                            attackSql = mysql.pool.query(attackSql,attackInserts,function(error, results, fields){
                                if(error){
                                    res.write(JSON.stringify(error));
                                    res.end();
                                } 
                                else {
                                    
                                    let newConnectionSql = "INSERT INTO rick_mortys (r_id, m_id) VALUES (?, ?)";
                                    let newConnectionInserts = [firstRickID, firstMortyID];
                                    
                                    newConnectionSql = mysql.pool.query(newConnectionSql,newConnectionInserts,function(error, results, fields){
                                        if(error){
                                            res.write(JSON.stringify(error));
                                            res.end();
                                        }
                                        else {
                                            res.redirect('/');
                                        }
                                    });
                                }
                            });   
                        }
                    });
                }
                else // User requested not to add a Morty
                    res.redirect('/');
            }
        });
    });

    return router;
}();


/*
let rick_Morty_ConnectionSql = "INSERT INTO rick_mortys (r_id, m_id) VALUES (?, ?)";
let rick_Morty_Inserts = [req.body.rickID, req.body.mortyID];

rick_Morty_Connection = mysql.pool.query(rick_Morty_ConnectionSql,rick_Morty_Inserts,function(error, results, fields){
    if(error){
        res.write(JSON.stringify(error));
        res.end();
    }else{
        res.redirect('/');
    }
});
*/