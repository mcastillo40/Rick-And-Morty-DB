var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_castimat',
  password        : '5321',
  database        : 'cs340_castimat'
});
module.exports.pool = pool;
