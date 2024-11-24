require('dotenv/config')

const mysql = require('mysql2')

const client = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'sales-api',
    user: 'root',
    password: 'Junior2311',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

exports.getUsers = (req, res, next) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM users;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error})}
                return res.status(200).send(result)
            }
        )
    })
}