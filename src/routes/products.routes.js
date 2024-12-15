require('dotenv').config()

const router = require('express').Router()

//
const upload = require('../middlewares/upload-img')
const login = require('../middlewares/login')

//

const productControllers = require('../controllers/products-controllers')


router.get('/products/', productControllers.getProducts)
router.post('/products/register/', login.required, upload.upload.single('product_image'), productControllers.createProduct)
router.get('/products/:product_id/', productControllers.detailProduct)
router.put('/products/updated/', login.required, productControllers.updatedProduct)
router.delete('/products/deleted/', login.required, productControllers.deleteProduct)


module.exports = router 