const Router = require('express');

const router = new Router();
const userController = require('../controller/user.controller');

router.post('/user', userController.createUser);
router.post('/user/login', userController.login);
router.get('/user', userController.getUsers);
router.put('/user', userController.updateUser);
router.put('/user/passport', userController.updatePassportInfo);
router.get('/user/passport/:id', userController.getUserPassportInfo);
router.delete('/user/:id', userController.deleteUser);
router.get('/user/:id', userController.getUsersById);

module.exports = router;