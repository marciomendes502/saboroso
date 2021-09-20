const mysql = require('mysql2');
const {db} = require('../.env')

const connection = mysql.createConnection({
    host: db.host,
    user: db.user,
    database: db.database,
    password: db.password,
    multipleStatements: true
  });

  module.exports = connection;