const router = require('express').Router()

const userControllers = require('../controllers/users-controllers')


router.get('/users', userControllers.getUsers)


module.exports = router