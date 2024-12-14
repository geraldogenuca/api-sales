require('dotenv').config()
const client = require('../config/mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.getUsers = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM users;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    quantity: result.length,
                    users: result.map(user => {
                            return {
                                user_id: user.user_id,
                                user_name: user.user_name,
                                user_email: user.user_email,
                                user_cpf: user.user_cpf,    
                                user_password: user.user_password,
                                user_phone: user.user_phone,
                                request: {
                                    type: 'POST',
                                    description: 'Register user!',
                                    url: process.env.URL_API + 'users/' + user.user_id
                                }
                            }
                        }
                    )
                }
                return res.status(200).send(response)
            }
        )
    })
}


exports.createUsers = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM users WHERE user_email = ?',
            req.body.user_email,
            (error, results) => {
                if(error) {return res.status(500).send({error: error})}
                if(results.length > 0) {
                    res.status(409).send({message: 'The user is registered!!!'})
                } else {
                    bcrypt.hash(req.body.user_password, 10, (errBcrypt, hash) => {
                        if(errBcrypt) {return res.status(500).send({error: errBcrypt})}
                        conn.query(
                            `INSERT 
                                INTO users (user_name, user_email, user_cpf, user_password, user_phone) 
                                VALUES (?, ?, ?, ?, ?);`,
                            [req.body.user_name, req.body.user_email, req.body.user_cpf, hash, req.body.user_phone],
                            (error, result, field) => {
                                conn.release()
                                if(error) {return res.status(500).send({error: error, response: null})}
                                res.status(200).send({
                                    message: 'User created successfully!',
                                    createdUser: {
                                        user_id: result.insertId,
                                        user_name: req.body.user_name,
                                        user_email: req.body.user_email,
                                        user_cpf: req.body.user_cpf,
                                        user_password: hash,
                                        user_phone: req.body.user_phone,
                                        request: {
                                            type: 'POST',
                                            description: 'Register user!',
                                            url: process.env.URL_API + 'users/' + result.insertId
                                        }
                                    }
                                })
                            }
                        )
                    });
                }
            }
        )
    })
}


exports.loginUser = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        const query = 'SELECT * FROM users WHERE user_email =?';
        conn.query(query, [req.body.user_email], (error, results, fields) => {
            conn.release();
            if(error) {return res.status(500).send({error: error})}
            if(results.length < 1) {
                return res.status(404).send({ message: 'Authentication failed!1'})
            }
            bcrypt.compare(req.body.user_password, results[0].user_password, (err, result) => {
                if(err) {
                    return res.status(401).send({message: 'Authentication failed!'})   
                }
                if(result) {
                    const token = jwt.sign({
                        user_id: results[0].user_id,
                        user_email: results[0].user_email,
                        user_password: results[0].user_password
                    }, 
                    process.env.SECRET_KEY, 
                    {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({
                        message: 'Authentication successfully!',
                        token: token
                    })
                }
                return res.status(401).send({message: 'Authentication failed!'})
            })
        })
    })
}


exports.detailUser = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM users WHERE user_id = ?;', [req.params.user_id],
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error, response: null})}
                if(result.length == 0) {
                    return res.status(404).send({message: 'User not found!'})
                }
                const response = {
                    user: {
                        user_id: result[0].user_id,
                        user_name: result[0].user_name,
                        user_email: result[0].user_email,
                        user_cpf: result[0].user_cpf,
                        user_phone: result[0].user_phone,
                        request: {
                            type: 'GET',
                            description: 'Return user specify.',
                            url: process.env.URL_API + 'users/' + result[0].user_id
                        }
                    }
                }
                return res.status(200).json(response);
            }
        )
    })
}


exports.updatedUser = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE users SET user_name = ?, user_email = ?, user_cpf = ?, user_phone = ? WHERE user_id_user = ?;`,
            [req.body.name, req.body.email, req.body.cpf, req.body.phone, req.params.id_user],
            (error, result, fields) => {
                conn.release()
                if(error) {return res.status(500).send({error: error})}
                response = {
                    message: `User id: ${req.params.id_user}, updated successfully.`,
                    user: {
                        user_id: req.params.user_id,
                        user_name: req.body.user_name,
                        user_email: req.body.user_email,
                        user_cpf: req.body.user_cpf,
                        user_phone: req.body.user_phone,
                        request: {
                            type: 'PATCH',
                            description: 'Updated user.',
                            'user': process.env.URL_API + 'users/' + req.params.user_id
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
            'DELETE FROM users WHERE user_id = ?;', [req.params.user_id],
            (error, result, fields) => {
                conn.release()
                if(error) {return res.status(500).send({error: error})}
                response = {
                    message: `User id: ${req.body.user_id}, deleted successfully.`,
                    request: {
                        type: 'DELETE',
                        description: 'Removed user.',
                        'deleted user': process.env.URL_API + 'users/' + req.params.user_id
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
}
