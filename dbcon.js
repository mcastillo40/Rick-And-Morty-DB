var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '127.0.0.1',
  user            : 'root',
  password        : 'Charming08!',
  database        : 'cs290_castimat'
});
module.exports.pool = pool;
