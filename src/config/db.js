const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// 1. Raw sqlite3 database (callback-compatible)
const db = new sqlite3.Database(
    './src/database/database.db',
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) console.error('SQLite callback DB error:', err.message);
        else console.log('Connected to database (callback DB)!');
    }
);

// 2. Promise-based database (async/await compatible)
const dbPromise = open({
    filename: './src/database/database.db',
    driver: sqlite3.Database
});

dbPromise
    .then(() => console.log('Connected to database (promise DB)!'))
    .catch(err => console.error('Promise DB connection error:', err.message));

// Export BOTH
module.exports = {
    db,         // callback API
    dbPromise   // async/await API
};
