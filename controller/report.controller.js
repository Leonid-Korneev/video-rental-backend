const db = require('../db');
const moment = require('moment');

class reportController {

    async getFilmByDirector(req, res) {
        const director = req.query.director
        const client = await db.connect();
        try {
            const films = await client.query(
                `select *
                 from films
                 where director = $1`,
                [director]
            );
            res.send(200, films.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }
    }

    async getRentedFilms(req, res) {
        const client = await db.connect();
        try {
            const films = await client.query(
                `select film_id, max(issue_date)
                 from logbook
                 where return_date is null
                 group by film_id`,
                []
            );
            res.send(200, films.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }
    }


    async getFilmsGroupByGenre(req, res) {
        const client = await db.connect();
        try {
            const films = await client.query(
                `select title, genre
                 from films
                 order by genre;`,
                []
            );
            res.send(200, films.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }
    }

    async getUserWithExpiredLogbooks(req, res) {
        const client = await db.connect();
        const currentDate10daysBack = moment().subtract(10, 'd').format("YYYY-MM-DD");
        try {
            const users = await client.query(
                `select user_id, max(issue_date), max(id), max(film_id)
                 from logbook
                 where issue_date <= $1::date and return_date is null
                 group by user_id`,
                [currentDate10daysBack]
            );
            res.send(200, users.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }
    }

}

module.exports = new reportController();