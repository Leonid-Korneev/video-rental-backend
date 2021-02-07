const Router = require('express');

const router = new Router();
const logbookController = require('../controller/logbook.controller');


router.post('/logbook', logbookController.createLogbook);


module.exports = router;