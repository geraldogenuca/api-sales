const router = require('express').Router()

const userControllers = require('../controllers/users-controllers')


router.get('/users', userControllers.getUsers)
router.get('/users/:id_user', userControllers.getOneUser)
router.post('/users/register', userControllers.createUsers)
router.patch('/users/update/:id_user', userControllers.updatedUser)
router.delete('/users/delete/:id_user', userControllers.deleteUser)

module.exports = router