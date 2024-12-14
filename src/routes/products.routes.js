const router = require('express').Router()
const client = require('mysql2').pool

const productControllers = require('../controllers/products-controllers')


router.get('/products', productControllers.getProducts)
router.post('/products/register', productControllers.createProduct)
router.get('/products/:product_id', productControllers.detailProduct)
router.put('/products/updated/:product_id', productControllers.updatedProduct)
router.delete('/products/deleted/:product_id', productControllers.deleteProduct)


module.exports = router 