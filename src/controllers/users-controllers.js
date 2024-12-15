require('dotenv').config()

const client = require('../config/mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.getUsers = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM users;')

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
                            type: 'GET',
                            description: 'Return all users!',
                            url: process.env.URL_API + 'users/' + user.user_id
                        }
                    }
                }
            )
        }

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}


exports.detailUser = async (req, res) => {
    try {
        const query = 'SELECT * FROM users WHERE user_id = ?;'

        const result = await client.execute(query, [req.params.user_id])

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
                    description: 'Return user specifies.',
                    url: process.env.URL_API + 'users/' + result[0].user_id
                }
            }
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }   
}


exports.createUser = async (req, res) => {
    try {        
        const query = `INSERT
                        INTO users (user_name, user_email, user_cpf, user_password, user_phone)
                        VALUES (?, ?, ?, ?, ?)`

        const result = await client.execute(query, [
            req.body.user_name, req.body.user_email, req.body.user_cpf, 
            bcrypt.hashSync(req.body.user_password, 10), req.body.user_phone
        ])

        const response = {
            message: 'User created successfully!',
            createdUser: {
                user_id: result.insertId,
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_cpf: req.body.user_cpf,
                user_password: req.body.user_password,
                user_phone: req.body.user_phone,
                request: {
                    type: 'POST',
                    description: 'Register user!',
                    url: process.env.URL_API + 'users/' + result.insertId
                }
            }
        }

        return res.status(201).send({response})
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


exports.loginUser = async (req, res) => {
    try {
        const query = 'SELECT * FROM users WHERE user_email =?'

        const results = await client.execute(query, [req.body.user_email])

        if(results.length < 1) {
            return res.status(404).send({ message: 'Authentication failed!'})
        }

        if(await bcrypt.compareSync(req.body.user_password, results[0].user_password)) {
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
    } catch (error) {
        return res.status(500).send({message: 'Authentication failed!'})
    }
}


exports.updatedUser = async (req, res) => {
    try {
        const query =   `UPDATE users SET 
                            user_name = ?, user_email = ?, user_cpf= ?, user_phone = ?, user_password = ? 
                        WHERE
                            user_id = ?`

        await client.execute(query, [
            req.body.user_name, req.body.user_email, req.body.user_cpf,
            req.body.user_password, req.body.user_phone, req.body.user_id
        ])

        response = {
            message: `User id: ${req.body.user_id}, updated successfully.`,
            user: {
                user_id: req.params.user_id,
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_cpf: req.body.user_cpf,
                user_password: req.body.user_password,
                user_phone: req.body.user_phone,
                request: {
                    type: 'PUT',
                    description: 'Updated user.',
                    'user': process.env.URL_API + 'users/' + req.body.user_id
                }
            }
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


exports.deleteUser = async (req, res) => {
    try {
        const query_test = 'SELECT * FROM users WHERE user_id = ?'

        const result = await client.execute(query_test, [req.body.user_id])

        if(result.length == 1) {
            const query = 'DELETE FROM users WHERE user_id = ?'

            await client.execute(query, [req.body.user_id])

            response = {
                message: `Product id: ${req.body.user_id}, deleted successfully!`,
                request: {
                    type: 'DELETE',
                    description: 'Removed user!',
                    delete_url_user: process.env.URL_API + 'user/' + req.body.user_id            }
            }
        } else {
            return res.status(500).send({message: 'User not found or deleted!'})
        }

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}
