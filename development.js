module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Obtains the information for the different dimensions that a Rick can be from
    function getUniverse(res, mysql, context, complete){
        mysql.pool.query("SELECT universe_id, name, population, species FROM universe", function(error, results, fields){
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

    // Get a specific Rick
    function getOneRick(res, mysql, context, id, complete){
        var sql = "SELECT rick.rick_id, fName, lName, level, dimension, type" +
        " FROM rick WHERE rick_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rick = results[0];
            complete();
        });
    }

    // Get a specific Morty
    function getOneMorty(res, mysql, context, id, complete){
        var sql = "SELECT morty.morty_id, fName, lName, level, health, defense" +
        " FROM morty WHERE morty_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.morty = results[0];
            complete();
        });
    }

    // Get a specific Universe
    function getOneUniverse(res, mysql, context, id, complete){
        var sql = "SELECT universe.universe_id, name, population, species " +
        " FROM universe WHERE universe_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.universe = results[0];
            complete();
        });
    }

    // Get a specific Attack
    function getOneAbility(res, mysql, context, id, complete){
        var sql = "SELECT attack_type.attack_id, ability, power " +
        " FROM attack_type WHERE attack_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ability = results[0];
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
        mysql.pool.query("SELECT A.attack_id, A.ability, A.power, M.morty_id FROM attack_type A "
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

    /* Display one person for the specific purpose of updating people */
    router.get('/update/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOneRick(res, mysql, context, req.params.id, complete);
        getUniverse(res, mysql, context, complete);
        getType(res, mysql, context, complete);
        getMortys(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){

                res.render('update-Rick', context);
            }
        }
    });


    // Delete a rick and morty connection
    function deleteConnections(res, mysql, morty_id, rick_id, complete){
        var sql = "DELETE FROM rick_mortys WHERE rick_mortys.m_id = ? AND rick_mortys.r_id = ?";
        var inserts = [morty_id, rick_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    // Add a rick and morty connection
    function addConnections (res, mysql, morty_id, rick_id, complete){
        var sql = "INSERT INTO rick_mortys (r_id, m_id) VALUES (?, ?)";
        var inserts = [rick_id, morty_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    // Update Rick's attributes
    function updateRick (res, mysql, fname, level, type, dimension, rickID, complete) {
        var sql = "UPDATE rick SET fName=?, level=?, type=?, dimension=? WHERE rick_id=?";
        let inserts = [fname, level, type, dimension, rickID];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    // Update Rick accordingly
    // Validate which Morty is being added or removed 
    router.post('/updateRick',function(req,res){
        
        let newMortyCount, prevMortyCount; 
        let callbackCount = 0;
        let totalCalls = 0; 
        let mysql = req.app.get('mysql');
    
        // Counts the different number of morty's from the previous to the updated rick
        if (req.body.newMorty)
            newMortyCount = req.body.newMorty.length; 
        else
            newMortyCount = 0;
        
        if (req.body.prevMorty)
            prevMortyCount = req.body.prevMorty.length; 
        else
            prevMortyCount = 0;
        
        // User selected to remove all mortys
        if (newMortyCount == 0 && prevMortyCount != 0) {
            for (let i = 0; i < prevMortyCount; i++){
                deleteConnections(res, mysql, req.body.prevMorty[i], req.body.rickID, complete);
                totalCalls += 1; 
            }
        }
        // User added morty's to a rick that had no mortys
        else if (prevMortyCount == 0 && newMortyCount >= 0) {
            for (let i = 0; i < newMortyCount; i++){
                addConnections (res, mysql, req.body.newMorty[i], req.body.rickID, complete);
                totalCalls += 1; 
            }
        }
        else if (prevMortyCount > newMortyCount) {
            let addMorty = [true];

            // Set all adds to true
            for (let i = 1; i < newMortyCount; i++) {
                addMorty.push(true);
            }

            // Delete previous morty if not found else keep it
            // Also set addMorty to any new morty's being included 
            for (i = 0; i < prevMortyCount; i++) {
                let prevMortyFound = false;

                for (let j = 0; j < newMortyCount; j++) {
                    if (req.body.prevMorty[i] == req.body.newMorty[j]){
                        prevMortyFound = true;
                        addMorty[j] = false;
                    }
                }

                // If previous morty was not included in the updated Rick then delete that morty
                if (!prevMortyFound) {
                    deleteConnections(res, mysql, req.body.prevMorty[i], req.body.rickID, complete);
                    totalCalls += 1;
                }
            }

            // Check which morty to add from the current update
            for (i = 0; i < newMortyCount; i++) {
                if (addMorty[i]) {
                    addConnections (res, mysql, req.body.newMorty[i], req.body.rickID, complete);
                    totalCalls += 1;
                }
            }    
        }
        else {
            let deleteMorty = [true]; 

            // Set all deletes to true
            for (let i = 1; i < prevMortyCount; i++) {
                deleteMorty.push(true);
            }

            // Delete previous morty if not found else keep it
            // Also set addMorty to any new morty's being included 
            for (i = 0; i < newMortyCount; i++) {
                let newMortyFound = false;

                for (let j = 0; j < prevMortyCount; j++) {
                    if (req.body.newMorty[j] == req.body.prevMorty[i]){
                        newMortyFound = true;
                        deleteMorty[j] = false;
                    }
                }

                // If previous morty was not included in the updated Rick then delete that morty
                if (!newMortyFound) {
                    addConnections (res, mysql, req.body.newMorty[i], req.body.rickID, complete);
                    totalCalls += 1; 
                }
            }

            // Check which morty to add from the current update
            for (i = 0; i < prevMortyCount; i++) {
                if (deleteMorty[i]) {
                    deleteConnections(res, mysql, req.body.prevMorty[i], req.body.rickID, complete);
                    totalCalls += 1; 
                }
            }    

        }
        
        // Update the standard information for a Rick
        updateRick(res, mysql, req.body.fname, req.body.level, req.body.type, req.body.dimension, req.body.rickID, complete);
        totalCalls += 1; 

        console.log("total: " + totalCalls);

        function complete(){
            callbackCount++;
            console.log("Complete: " + callbackCount);

            if(callbackCount >= totalCalls){

                res.status(200);
                res.redirect('/');
                res.end();
            }
        }
      
    });

    /* Send information from the database to the web app */
    router.get('/morty', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteRick.js"];
        var mysql = req.app.get('mysql');
        getMortys(res, mysql, context, complete);
        getRicksMortys(res, mysql, context, complete);
        getAttackType(res, mysql, context, complete);
        getMortyMaxID(res, mysql, context, complete);
        function complete(){
            // Increase callbackCount everytime function was called
            // Render page after everything was completed
            callbackCount++; 

            if(callbackCount >= 4){
                res.render('morty', context);
            }

        }
    });

    // Adds a new Morty with their linked attack
    router.post('/addMorty', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO morty (fName, lName, level, health, defense) VALUES (?,?,?,?,?)";
        var inserts = [req.body.mortyfName, req.body.mortylName, req.body.mortyLevel, req.body.mortyHealth, req.body.mortyDefense];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                // Adds an attack for a morty
                var newSql = "INSERT INTO morty_attacks (m_id, a_id) VALUES (?, ?)";
                var newInserts = [req.body.mortyID, req.body.mortyAttack];

                newSql = mysql.pool.query(newSql,newInserts,function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{

                        res.redirect('/morty');
                    }
                });
            }
        });
    });

    // Route to delete a Morty, simply returns a 202 upon success. Ajax will handle this. 
    // The function first deletes the connection between mortys and attacks then
    // will delete the morty that was requested to be removed by the user
    router.post('/deleteMorty', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM morty_attacks WHERE morty_attacks.m_id = ?";
        var inserts = [req.query.morty_id];
        
        // First remove attacks linked with morty
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                // Remove lenks with ricks
                var sql = "DELETE FROM rick_mortys WHERE rick_mortys.m_id = ?";
                sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.status(400);
                        res.end();
                    }else{  
                        // Remove morty
                        var newSql = "DELETE FROM morty WHERE morty.morty_id = ?";
                        newSql = mysql.pool.query(newSql, inserts, function(error, results, fields){
                            if(error){
                                res.write(JSON.stringify(error));
                                res.status(400);
                                res.end();
                            }else{
                                res.redirect('/morty');
                            }
                        })
                    }
                })
            }
        })
    });

    /* Display one person for the specific purpose of updating people */
    router.get('/updateMorty/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOneMorty(res, mysql, context, req.params.id, complete);
        getAttackType(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){

                res.render('update-Morty', context);
            }
        }
    });

    // Delete a morty and morty connection
function deleteAttackConnections(res, mysql, attack_id, morty_id, complete){
    var sql = "DELETE FROM morty_attacks WHERE morty_attacks.m_id = ? AND morty_attacks.a_id = ?";
    var inserts = [morty_id, attack_id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        complete();
    });
}

// Add a morty and attack connection
function addAttackConnection (res, mysql, attack_id, morty_id, complete){
    var sql = "INSERT INTO morty_attacks (a_id, m_id) VALUES (?, ?)";
    var inserts = [attack_id, morty_id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        complete();
    });
}

// Update Morty's attributes
function updateMorty (res, mysql, fname, level, health, defense, mortyID, complete) {
    var sql = "UPDATE morty SET fName=?, level=?, health=?, defense=? WHERE morty_id=?";
    let inserts = [fname, level, health, defense, mortyID];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        complete();
    });
}

// Update Morty accordingly
// Validate which Attack is being added or removed 
router.post('/updateMorty',function(req,res){
    
    let newAttackCount, prevAttackCount; 
    let callbackCount = 0;
    let totalCalls = 0; 
    let mysql = req.app.get('mysql');

    // Counts the different number of attack's from the previous to the updated morty
    if (req.body.newAttack)
        newAttackCount = req.body.newAttack.length; 
    else
        newAttackCount = 0;
    
    if (req.body.prevAttack)
        prevAttackCount = req.body.prevAttack.length; 
    else
        prevAttackCount = 0;
    
    // User selected to remove all attacks
    if (newAttackCount == 0 && prevAttackCount != 0) {
        for (let i = 0; i < prevAttackCount; i++){
            deleteAttackConnections(res, mysql, req.body.prevAttack[i], req.body.mortyID, complete);
            totalCalls += 1; 
        }
    }
    // User added attacks's to a morty that had no attacks
    else if (prevAttackCount == 0 && newAttackCount >= 0) {
        for (let i = 0; i < newAttackCount; i++){
            addAttackConnection (res, mysql, req.body.newAttack[i], req.body.mortyID, complete);
            totalCalls += 1; 
        }
    }
    else if (prevAttackCount > newAttackCount) {
        let addAttack = [true];

        // Set all adds to true
        for (let i = 1; i < newAttackCount; i++) {
            addAttack.push(true);
        }

        // Delete previous attacks if not found else keep it
        // Also set addAttack to any new morty's being included 
        for (i = 0; i < prevAttackCount; i++) {
            let prevAttackFound = false;

            for (let j = 0; j < newAttackCount; j++) {
                if (req.body.prevAttack[i] == req.body.newAttack[j]){
                    prevAttack = true;
                    addAttack[j] = false;
                }
            }

            // If previous attack was not included in the updated Morty then delete that attack
            if (!prevAttackFound) {
                deleteAttackConnections(res, mysql, req.body.prevAttack[i], req.body.mortyID, complete);
                totalCalls += 1;
            }
        }

        // Check which attack to add from the current update
        for (i = 0; i < newAttackCount; i++) {
            if (addAttack[i]) {
                addAttackConnection (res, mysql, req.body.newAttack[i], req.body.mortyID, complete);
                totalCalls += 1;
            }
        }    
    }
    else {
        let deleteAttack = [true]; 

        // Set all deletes to true
        for (let i = 1; i < prevAttackCount; i++) {
            deleteAttack.push(true);
        }

        // Delete previous attack if not found else keep it
        // Also set addAttack to any new attacks's being included 
        for (i = 0; i < newAttackCount; i++) {
            let newAttackFound = false;

            for (let j = 0; j < prevAttackCount; j++) {
                if (req.body.newAttack[j] == req.body.prevAttack[i]){
                    newAttackFound = true;
                    deleteAttack[j] = false;
                }
            }

            // If previous attack was not included in the updated Morty then delete that attack
            if (!newAttackFound) {
                addAttackConnection (res, mysql, req.body.newAttack[i], req.body.mortyID, complete);
                totalCalls += 1; 
            }
        }

        // Check which attack to add from the current update
        for (i = 0; i < prevAttackCount; i++) {
            if (deleteAttack[i]) {
                deleteAttackConnections(res, mysql, req.body.prevAttack[i], req.body.mortyID, complete);
                totalCalls += 1; 
            }
        }    

    }
    
    // Update the standard information for a Morty
    updateMorty(res, mysql, req.body.fname, req.body.level, req.body.health, req.body.defense, req.body.mortyID, complete);
    totalCalls += 1; 

    console.log("total: " + totalCalls);

    function complete(){
        callbackCount++;
        console.log("Complete: " + callbackCount);

        if(callbackCount >= totalCalls){

            res.status(200);
            res.redirect('/morty');
            res.end();
        }
    }
  
});

    // Render Universe page
    router.get('/universe', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getUniverse(res, mysql, context, complete);

        function complete(){
            callbackCount++; 

            if(callbackCount >= 1){

                res.render('universe', context);
            }

        }
    });

    // Adds a new Universe
    router.post('/addUniverse', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO universe (name, population, species) VALUES (?,?,?)";
        var inserts = [req.body.universeName, req.body.population, req.body.species];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{

                res.redirect('/universe');

            }
        });
    });

    //Delete a universe
    router.post('/deleteUniverse', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM universe WHERE universe.universe_id = ?";
        var inserts = [req.query.universe_id];
        
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
               
                res.redirect('/universe');
            }
        })
        
    });

    /* Display one person for the specific purpose of updating people */
    router.get('/updateUniverse/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOneUniverse(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){

                res.render('update-Universe', context);
            }
        }
    });

    // Update universe's attributes
    function updateUniverse (res, mysql, name, populaton, species, u_id, complete) {
        var sql = "UPDATE universe SET name=?, population=?, species=? WHERE universe_id=?";
        let inserts = [name, populaton, species, u_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    // Update universe's attributes
    router.post('/updateThisUniverse', function(req, res){
        var mysql = req.app.get('mysql');
        let callbackCount = 0;

        updateUniverse(res, mysql, req.body.name, req.body.population, req.body.species, req.body.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){

                res.redirect('/universe');
            }
        }

    });

    // Render ability page
    router.get('/abilities', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getAttackType(res, mysql, context, complete);

        function complete(){
            callbackCount++; 

            if(callbackCount >= 1){
                res.render('abilities', context);
            }

        }
    });

    // Adds a new Ability for a morty
    router.post('/addAbility', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO attack_type (ability, power) VALUES (?,?)";
        var inserts = [req.body.abilityName, req.body.power];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{

                res.redirect('/abilities');

            }
        });
    });

    // Delete an attack type
    // First delete it's connection with a morty type then delete the attack
    router.post('/deleteAbility', function(req, res){
        var mysql = req.app.get('mysql');

        var sql = "DELETE FROM morty_attacks WHERE morty_attacks.a_id = ?";
        var inserts = [req.query.attack_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                var newSql = "DELETE FROM attack_type WHERE attack_type.attack_id = ?";
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

    /* Display one person for the specific purpose of updating people */
    router.get('/updateAbility/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOneAbility(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){

                res.render('update-Ability', context);
            }
        }
    });

    // Update Attacks's attributes
    function updateAbility (res, mysql, name, power, a_id,  complete) {
        var sql = "UPDATE attack_type SET ability=?, power=? WHERE attack_id=?";
        let inserts = [name, power, a_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }
    
    router.post('/updateThisAbility', function(req, res){
        var mysql = req.app.get('mysql');
        let callbackCount = 0;

        updateAbility(res, mysql, req.body.ability, req.body.power, req.body.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){

                res.redirect('/abilities');
            }
        }

    });

    return router;
}();