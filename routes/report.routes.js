const Router = require('express');

const router = new Router();
const reportController = require('../controller/report.controller');

router.get('/report/director', reportController.getFilmByDirector);
router.get('/report/rented-films', reportController.getRentedFilms);
router.get('/report/oder-by-genre', reportController.getFilmsGroupByGenre);
router.get('/report/10days', reportController.getUserWithExpiredLogbooks);

module.exports = router;
