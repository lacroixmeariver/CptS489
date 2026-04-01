const sqlite3 = require('sqlite3').verbose();
let sql;

// connecting to the db 
const db = new sqlite3.Database('./src/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to database!');
});

module.exports = db;