require('dotenv').config()
const client = require('../config/mysql').pool


exports.getProducts = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM products;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error})}
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
                                    description: 'Register product!',
                                    product_url: process.env.URL_API + 'products/' + product.product_id
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


exports.createProduct = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM products WHERE product_name = ?',
            req.body.product_name,
            (error, results) => {
                if(error) {return res.status(500).send({error: error})}
                if(results.length > 0) {
                    res.status(409).send({message: 'The product is registered!!!'})
                } else {
                    conn.query(
                        `INSERT 
                            INTO products (product_name, product_description, product_image, product_price) 
                            VALUES (?, ?, ?, ?);`,
                        [req.body.product_name, req.body.product_description, req.body.product_image, req.body.product_price],
                        (error, result, field) => {
                            conn.release()
                            if(error) {return res.status(500).send({error: error, response: null})}
                            res.status(200).send({
                                message: 'Product created successfully!',
                                createdUser: {
                                    product_id: result.insertId,
                                    product_name: req.body.product_name,
                                    product_description: req.body.product_description,
                                    product_image: req.body.product_image,
                                    product_price: req.body.product_price,
                                    request: {
                                        type: 'POST',
                                        description: 'Register products!',
                                        product_url: process.env.URL_API + 'products/' + result.insertId
                                    }
                                }
                            })
                        }
                    )
                }
            }
        )
    })
}


exports.detailProduct = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM products WHERE product_id = ?;', [req.params.product_id],
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error, response: null})}
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
                            description: 'Return product specify.',
                            product_url: process.env.URL_API + 'products/' + result[0].product_id
                        }
                    }
                }
                return res.status(200).json(response);
            }
        )
    })
}


exports.updatedProduct = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE products SET product_name = ?, product_description = ?, product_image = ?, product_price = ? WHERE product_id = ?;`,
            [req.body.product_name, req.body.product_description, req.body.product_image, req.body.product_price, req.params.product_id],
            (error, result, fields) => {
                conn.release()
                if(error) {return res.status(500).send({error: error})}
                response = {
                    message: `Product id: ${req.params.product_id}, updated successfully.`,
                    product: {
                        product_id: req.params.product_id,
                        product_name: req.body.product_name,
                        product_description: req.body.product_description,
                        product_image: req.body.product_image,
                        product_price: req.body.product_price,
                        request: {
                            type: 'PUT',
                            description: 'Updated product.',
                            product_url: process.env.URL_API + 'products/' + req.params.product_id
                        }
                    }
                }
                return res.status(200).json(response)
            }
        )
    })
}


exports.deleteProduct = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM products WHERE product_id = ?;', [req.params.product_id],
            (error, result, fields) => {
                conn.release()
                if(error) {return res.status(500).send({error: error})}
                response = {
                    message: `Product id: ${req.body.product_id}, deleted successfully.`,
                    request: {
                        type: 'DELETE',
                        description: 'Removed product.',
                        deleted_url_product: process.env.URL_API + 'product/' + req.params.product_id
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
}


/*exports.deleteProduct = (req, res) => {
    client.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM products WHERE product_id = ?', [req.params.product_id],
            (error, result) => {
                if(result.length > 0) {
                    'DELETE FROM products WHERE product_id = ?;', [req.params.product_id],
                    (error, result, fields) => {
                        conn.release()
                        if(error) {return res.status(500).send({error: error})}
                        response = {
                            message: `Product id: ${req.body.product_id}, deleted successfully.`,
                            request: {
                                type: 'DELETE',
                                description: 'Removed product.',
                                deleted_url_product: process.env.URL_API + 'product/' + req.params.product_id
                            }
                        }
                        return res.status(200).send(response)
                    }
                }
                return res.status(500).send({message: 'Esee agaga'})
            }
        )
    })
}*/

