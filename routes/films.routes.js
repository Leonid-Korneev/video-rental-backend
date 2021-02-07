const Router = require('express');
const router = new Router();
const filmsController = require('../controller/films.controller');

router.post('/film', filmsController.createFilm);
router.get('/film', filmsController.getFilmsList);
router.delete('/film/:id', filmsController.deleteFilm);
router.put('/film', filmsController.updateFilm);

module.exports = router;