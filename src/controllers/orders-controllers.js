require('dotenv').config()

const client = require('../config/mysql')


exports.getOrders = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM orders;')

        const response = {
            quantity: result.length,
            orders: result.map(order => {
                return {
                    order_id: order.order_id,
                    product_id: order.product_id,
                    order_quantity: order.order_quantity,
                    request: {
                        type: 'GET',
                        description: 'Return all orders!',
                        url: process.env.URL_API + 'orders/' + order.order_id
                    }
                }
            })
        }

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({error: error})
    }
}


exports.detailsOrder = async (req, res) => {
    try {
        const query = 'SELECT * FROM orders WHERE order_id = ?;'

        const result = await client.execute(query, [req.params.order_id])

        if(result.length == 0) {
            return res.status(404).send({message: 'Order not found!'})
        }

        const response = {
            order: {
                order_id: result[0].order_id,
                product_id: result[0].product_id,
                order_quantity: result[0].order_quantity,
                request: {
                    type: 'GET',
                    description: 'Return order specifies.',
                    url: process.env.URL_API + 'orders/' + result[0].order_id
                }
            }
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


exports.createOrders = async (req, res) => {
    try {
        const query = 'INSERT INTO orders (product_id, order_quantity) VALUES (?, ?);'

        const result = await client.execute(query, [req.body.product_id, req.body.order_quantity])

        const response = {            
            message: 'Order created successfully!',
            createdOrder: {
                order_id: result.insertId,
                product_id: req.body.product_id,
                order_quantity: req.body.order_quantity,
                request: {
                    type: 'POST',
                    description: 'Register order!',
                    url: process.env.URL_API + 'orders/' + result.insertId
                }
            }            
        }

        return res.status(201).send({response})
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

exports.updatedOrder = async (req, res) => {
    try {
        const query =   `UPDATE orders SET product_id =?, order_quantity = ? WHERE order_id = ?`

        await client.execute(query, [req.body.product_id, req.body.order_quantity, req.body.order_id])

        response = {
            message: `Order id: ${req.body.order_id}, updated successfully.`,
            order: {
                order_id: req.body.order_id,
                product_name: req.body.product_id,                
                order_quantity: req.body.order_quantity,                
                request: {
                    type: 'PUT',
                    description: 'Updated order.',
                    'user': process.env.URL_API + 'orders/' + req.body.order_id
                }
            }
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


exports.deleteOrder = async (req, res) => {
    try {
        const query_test = 'SELECT * FROM orders WHERE order_id = ?'

        const result = await client.execute(query_test, [req.body.order_id])

        if(result.length == 1) {
            const query = 'DELETE FROM orders WHERE order_id = ?'

            await client.execute(query, [req.body.order_id])

            response = {
                message: `Order id: ${req.body.order_id}, deleted successfully!`,
                request: {
                    type: 'DELETE',
                    description: 'Removed order!',
                    delete_url_user: process.env.URL_API + 'user/' + req.body.order_id            }
            }
        } else {
            return res.status(500).send({message: 'Order not found or deleted!'})
        }

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}