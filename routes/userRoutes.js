const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/create',  userController.createUser);


router.get('/', authMiddleware.isAdmin, userController.getAllUsers);


router.get('/:id',  userController.getUserById);


router.put('/:id',  userController.updateUser);


router.delete('/:id', authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
