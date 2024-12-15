const router = require('express').Router()

const orderControllers = require('../controllers/orders-controllers')


router.get('/orders/', orderControllers.getOrders)
router.get('/orders/:order_id', orderControllers.detailsOrder)
router.post('/orders/register/', orderControllers.createOrders)
router.put('/orders/update/',orderControllers.updatedOrder)
router.delete('/orders/delete/', orderControllers.deleteOrder)


module.exports = router