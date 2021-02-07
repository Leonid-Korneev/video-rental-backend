const Router = require('express');

const router = new Router();
const userController = require('../controller/user.controller');

router.post('/user', userController.createUser);
router.post('/user/login', userController.login);
router.get('/user', userController.getUsers);
router.put('/user', userController.updateUser);
router.put('/user/passport', userController.updatePassportInfo);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;