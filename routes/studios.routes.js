const Router = require('express');
const router = new Router();
const studiosController = require('../controller/studios.controller');

router.post('/studio', studiosController.createStudio);
router.put('/studio', studiosController.updateStudio);
router.get('/studio', studiosController.getStudiosList);

module.exports = router;