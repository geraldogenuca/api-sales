require('dotenv').config()
const mysql = require('mysql2')

var pool = mysql.createPool({
    "connectionLimit" : 1000,
    "user" : 'root',
    "password": 'Junior2311',
    "database" : 'sales-api',
    "host": process.env.MYSQL_HOST,
    "port" : process.env.MYSQL_PORT
});

exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(result)
            }
        });
    })
}

exports.pool = pool