require('dotenv').config()

const client = require('../config/mysql')


exports.getProducts = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM products;')
        const response = {
            quantity: result.length,
            users: result.map(product => {
                    return {
                        product_id: product.product_id,
                        product_name: product.product_name,
                        product_description: product.product_description,    
                        product_image: product.product_image,
                        product_price: product.product_price,
                        request: {
                            type: 'GET',
                            description: 'Return all products!',
                            product_url: process.env.URL_API + 'products/' + product.product_id
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


exports.detailProduct = async (req, res) => {
    try {
        const query = 'SELECT * FROM products WHERE product_id = ?;'
        const result = await client.execute(query, [req.params.product_id])

        if(result.length == 0) {
            return res.status(404).send({message: 'Product not found!'})
        }

        const response = {
            product: {
                product_id: result[0].product_id,
                product_name: result[0].product_name,
                product_description: result[0].product_description,
                product_image: result[0].product_image,
                product_price: result[0].product_price,
                request: {
                    type: 'GET',
                    description: 'Return product specifies.',
                    product_url: process.env.URL_API + 'products/' + result[0].product_id
                }
            }
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


exports.createProduct = async (req, res) => {
    try {
        const query = `INSERT 
                        INTO products (product_name, product_description, product_image, product_price) 
                        VALUES (?, ?, ?, ?);`

        const result = await client.execute(query, [
            req.body.product_name, req.body.product_description, req.file.path, req.body.product_price
        ])

        const response = {
            message: 'Product created successfully!',
            createdUser: {
                product_id: result.insertId,
                product_name: req.body.product_name,
                product_description: req.body.product_description,
                product_image: req.file.path,
                product_price: req.body.product_price,
                request: {
                    type: 'POST',
                    description: 'Register products!',
                    product_url: process.env.URL_API + 'products/' + result.insertId
                }
            }
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


exports.updatedProduct = async (req, res) => {
    try {
        const query = `UPDATE products SET product_name = ?, product_description = ?, product_image = ?, product_price = ? WHERE product_id = ?;`
        
        await client.execute(query, [req.body.product_name, req.body.product_description, req.body.product_image, req.body.product_price, req.body.product_id])

        response = {
            message: `Product id: ${req.body.product_id}, updated successfully.`,
            product: {
                product_id: req.body.product_id,
                product_name: req.body.product_name,
                product_description: req.body.product_description,
                product_image: req.body.product_image,
                product_price: req.body.product_price,
                request: {
                    type: 'PUT',
                    description: 'Updated product.',
                    product_url: process.env.URL_API + 'products/' + req.body.product_id
                }
            }
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


exports.deleteProduct = async (req, res) => {
    try {
        const query_test = 'SELECT * FROM products WHERE product_id = ?'

        const result = await client.execute(query_test, [req.body.product_id])

        if(result.length == 1) {
            const query = 'DELETE FROM products WHERE product_id = ?;'

            await client.execute(query, [req.body.product_id])

            response = {
                message: `Product id: ${req.body.product_id}, deleted successfully.`,
                request: {
                    type: 'DELETE',
                    description: 'Removed product.',
                    deleted_url_product: process.env.URL_API + 'product/' + req.body.product_id
                }
            }
        } else {
            return res.status(500).send({message: 'Product not found or deleted!'})
        }      

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}




