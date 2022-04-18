const mariadb = require('mariadb');

const meta = mariadb.createPool({
    user: "root",
    password: "12345",
    host: "localhost",
    database: "baker"
});

async function getConnection(){
    return await meta.getConnection();
}

module.exports = getConnection();
