require('dotenv').config()
const client = require('../config/mysql').pool

exports.getUsers = (req, res) => {
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

exports.createUsers = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO users (name, email, cpf, password, phone) VALUES (?, ?, ?, ?, ?);',
            [req.body.name, req.body.email, req.body.cpf, req.body.password, req.body.phone],
            (error, result, field) => {
                if(error) {return res.status(500).send({error: error, response: null})}
                res.status(200).send({
                    message: 'User created successfully!',
                    createdUser: {
                        id_user: result.insertId,
                        name: req.body.name,
                        email: req.body.email,
                        cpf: req.body.cpf,
                        password: req.body.password,
                        phone: req.body.phone,
                        request: {
                            type: 'POST',
                            description: 'Register user!',
                            url: 'http://localhost:5001/api/users/' + result.insertId
                        }
                    }
                })
            }
        )
    })
}

exports.getOneUser = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM users WHERE id_user = ?;', [req.params.id_user],
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error, response: null})}
                if(result.length == 0) {
                    return res.status(404).send({message: 'User not found!'})
                }
                const response = {
                    user: {
                        id_user: result[0].id_user,
                        name: result[0].name,
                        email: result[0].email,
                        cpf: result[0].cpf,
                        phone: result[0].phone,
                        request: {
                            type: 'GET',
                            description: 'Return user specify.',
                            url: 'http://localhost:5001/api/users/' + result[0].id_user
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    })
}

exports.updatedUser = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE users SET name = ?, email = ?, cpf = ?, phone = ? WHERE id_user = ?;`,
            [req.body.name, req.body.email, req.body.cpf, req.body.phone, req.params.id_user],
            (error, result, fields) => {
                conn.release()
                if(error) {return res.status(500).send({error: error})}
                response = {
                    message: `User id: ${req.params.id_user}, updated successfully.`,
                    user: {
                        id_user: req.params.id_user,
                        name: req.body.name,
                        email: req.body.email,
                        cpf: req.body.cpf,
                        phone: req.body.phone,
                        request: {
                            type: 'PATCH',
                            description: 'Updated user.',
                            'user': 'http://localhost:5001/api/user/' + req.params.id_user
                        }
                    }
                }
                return res.status(200).json(response)
            }
        )
    })
}

exports.deleteUser = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM users WHERE id_user = ?;', [req.params.id_user],
            (error, result, fields) => {
                conn.release()
                if(error) {return res.status(500).send({error: error})}
                response = {
                    message: `User id: ${req.body.id_user}, deleted successfully.`,
                    request: {
                        type: 'DELETE',
                        description: 'Removed user.',
                        'deleted user': 'http://localhost:5001/api/user/' + req.params.id_user
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
}