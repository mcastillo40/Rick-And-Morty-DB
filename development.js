module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Obtains the information for the different dimensions that a Rick can be from
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

    // Obtains the different attack types for a morty
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
            + "INNER JOIN rick ON rick_mortys.r_id = rick.rick_id WHERE rick.rick_id = 2", 
        function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rick_catches = results;
            complete();
        });
    }

    // Send the different morty's for a Rick
    router.get('/ricksMortys', function(req, res, next){
        var mysql = req.app.get('mysql');
        
        mysql.pool.query("SELECT morty.morty_id, morty.fname, morty.lname, morty.level, morty.health, morty.defense FROM rick_mortys "
            + "INNER JOIN morty ON rick_mortys.m_id = morty.morty_id "
            + "INNER JOIN rick ON rick_mortys.r_id = rick.rick_id "
            + "WHERE rick.rick_id = ?", 
            [req.query.id], function(err, result){
            if(err){
                next(err);
                return;
            }  

            // Sends the ability and power of the attack for a morty
            res.send(result);
        });
    });

    // Send the information of the different morty's
    router.get('/getRickInfo', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getRicks(res, mysql, context, complete);
        function complete(){
            // Increase callbackCount everytime function was called
            // Render page after everything was completed
            callbackCount++; 

            if(callbackCount >= 1){

                // Send the information of Ricks
                res.send(context);
            }
        }
    });

    // Gets the id for the next Rick in the table
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

    // Gets the id for the next Morty in the table
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

    // Send the information of the different morty's
    router.get('/mortyInfo', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getMortys(res, mysql, context, complete);
        function complete(){
            // Increase callbackCount everytime function was called
            // Render page after everything was completed
            callbackCount++; 

            if(callbackCount >= 1){
                // Send the information of a morty
                res.send(context);
            }
        }
    });

    // Send the different attacks that a morty contains
    router.get('/mortyAttacks', function(req, res, next){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT A.ability, A.power FROM attack_type A "
            + " INNER JOIN morty_attacks MA ON MA.a_id = A.attack_id "
            + " INNER JOIN morty M ON M.morty_id = MA.m_id "
            + "WHERE M.morty_id = ?", 
            [req.query.id], function(err, result){
            if(err){
                next(err);
                return;
            }  
            // Sends the ability and power of the attack for a morty
            res.send(result);
        });
    });


    /* Send information from the database to the web app */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteRick.js"];
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

    /* Adds a Rick with attributes as well as a morty if the user decides to add one to the rick,
        then redirects to the home page after adding */
    router.post('/', function(req, res){

        // Get Rick's basic information first
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO rick (fName, lName, level, type, dimension) VALUES (?,?,?,?,?)";
        let inserts = [req.body.fname, req.body.lname, req.body.level, req.body.type, req.body.dimension];

        if (req.body.fname != "") {
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){ 
                    res.write(JSON.stringify(error));
                    res.end();
                }
                else {
                    // Get the information from select Morty to validate whether the user
                    // wanted to add a morty
                    let newSql = "INSERT INTO rick_mortys (r_id, m_id) VALUES (?, ?)";
                    let newInserts = [req.body.rickID, req.body.morty];
                    let firstRickID = req.body.rickID;

                    if (req.body.morty > 0) { // User requested to add a pre-existing Morty

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
                        
                        // Get basic information for a morty 
                        let mortySql = "INSERT INTO morty (fName, lName, level, health, defense) VALUES (?,?,?,?,?)";
                        let mortyInserts = [req.body.mortyfName, req.body.mortylName, req.body.mortyLevel, req.body.mortyHealth, req.body.mortyDefense];

                        mortySql = mysql.pool.query(mortySql,mortyInserts,function(error, results, fields){
                            if(error){
                                res.write(JSON.stringify(error));
                                res.end();
                            }
                            else {

                                // Get the type of attack chosen for the morty
                                let attackSql = "INSERT INTO morty_attacks (m_id, a_id) VALUES (?, ?)";
                                let attackInserts = [req.body.mortyID, req.body.mortyAttack];
                                let firstMortyID = req.body.mortyID;

                                attackSql = mysql.pool.query(attackSql,attackInserts,function(error, results, fields){
                                    if(error){
                                        res.write(JSON.stringify(error));
                                        res.end();
                                    } 
                                    else {

                                        // Link the Rick and Morty 
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
                    else { // User requested not to add a Morty 
                        res.redirect('/');
                    }
                }
            });
        }
        else // Nothing happens if user entered an empty value for a nameless Rick
            res.redirect('/');
    });

    // Route to delete a Rick, simply returns a 202 upon success. Ajax will handle this. 
    // The function first deletes the connection between rick and mortys then
    // will delete the rick that was requested to be removed by the user
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM rick_mortys WHERE rick_mortys.r_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                var newSql = "DELETE FROM rick WHERE rick.rick_id = ?";
                newSql = mysql.pool.query(newSql, inserts, function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.status(400);
                        res.end();
                    }else{
                
                        res.status(202).end();
                    }
                })
            }
        })
    })

    return router;
}();

