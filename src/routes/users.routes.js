const router = require('express').Router()

const userControllers = require('../controllers/users-controllers')


router.get('/users', userControllers.getUsers)
router.get('/users/:user_id', userControllers.detailUser)
router.post('/users/register', userControllers.createUsers)
router.post('/users/login', userControllers.loginUser)
router.put('/users/update/:user_id', userControllers.updatedUser)
router.delete('/users/delete/:user_id', userControllers.deleteUser)

module.exports = router