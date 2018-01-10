// All functions will be exported

// Obtains the information for the different dimensions that a Rick can be from
export function getUniverse(res, mysql, context, complete){
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
export function getType(res, mysql, context, complete){
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
export function getRicks(res, mysql, context, complete){
    mysql.pool.query("SELECT rick.rick_id, fname, lname, level, universe.name AS dimension, rick_type.type AS type "
        + "FROM rick LEFT JOIN universe ON dimension = universe.universe_id " 
        + "LEFT JOIN rick_type ON rick.type = rick_type.rick_type_id", 
    function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        console.log(results);
        context.ricks = results;
        complete();
    });
}

// Obtains the different Rick's in the database
export function getRicksPlanet(res, mysql, context, complete){
    mysql.pool.query("SELECT rick.rick_id, fname, lname, level, universe.name AS dimension, rick_type.type AS type "
        + "FROM rick INNER JOIN universe ON dimension = universe.universe_id " 
        + "INNER JOIN rick_type ON rick.type = rick_type.rick_type_id", 
    function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        console.log(results);
        context.ricks = results;
        complete();
    });
}

// Obtains the different Morty's in the database
export function getMortys(res, mysql, context, complete){
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
export function getAttackType(res, mysql, context, complete){
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
export function getRicksMortys(res, mysql, context, complete){
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
export function getOneRick(res, mysql, context, id, complete){
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
export function getOneMorty(res, mysql, context, id, complete){
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
export function getOneUniverse(res, mysql, context, id, complete){
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
export function getOneAbility(res, mysql, context, id, complete){
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

// Gets the id for the next Rick in the table
export function getNextMaxID(res, mysql, context, complete){
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
export function getMortyMaxID(res, mysql, context, complete){
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

// Add a rick and morty connection
export function addConnections (res, mysql, morty_id, rick_id, complete){
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

// Delete a rick and morty connection
export function deleteConnections(res, mysql, morty_id, rick_id, complete){
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

// Update Rick's attributes
export function updateRick (res, mysql, fname, level, type, dimension, rickID, complete) {
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

// Delete a morty and morty connection
export function deleteAttackConnections(res, mysql, attack_id, morty_id, complete){
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
export function addAttackConnection (res, mysql, attack_id, morty_id, complete){
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
export function updateMorty (res, mysql, fname, level, health, defense, mortyID, complete) {
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

// Update universe's attributes
export function updateUniverse (res, mysql, name, populaton, species, u_id, complete) {
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

// Update Attacks's attributes
export function updateAbility (res, mysql, name, power, a_id,  complete) {
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
