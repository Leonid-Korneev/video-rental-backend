const Router = require('express');

const router = new Router();
const logbookController = require('../controller/logbook.controller');


router.post('/logbook', logbookController.createLogbook);
router.put('/logbook', logbookController.updateLogbook);
router.get('/logbook/:id', logbookController.getUserLogbookList);
router.get('/logbook', logbookController.getFullLogbookList);


module.exports = router;