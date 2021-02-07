const db = require('../db');

class FilmsController {

    async createFilm(req, res) {
        const {title, genre, studioId, director, actors, year, annotation, price} = req.body;
        const client = await db.connect();
        const filmWithSameName = await client.query(`
                    select *
                    from films
                    where title = $1`,
            [title]
        );
        if (!filmWithSameName.rows.length) {
            try {
                const film = await client.query(`
                            insert into films (title, genre, studio_id, director, actors, year, annotation, price)
                            values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`,
                    [title, genre, studioId, director, actors, year, annotation, price]
                );
                res.send(200, film.rows[0]);

            } catch (e) {
                res.send(500, e.message);
            } finally {

            }


        } else {
            res.send(500, 'Данный фильм уже существуeт');
        }

    }

    async updateFilm(req, res) {
        const {id, title, genre, studioId, director, actors, year, annotation, price} = req.body;
        const client = await db.connect();
        try {
            await client.query(
                ` update films
                  set title=$1,
                      genre=$2,
                      studio_id=$3,
                      director=$4,
                      actors=$5,
                      year=$6,
                      annotation=$7,
                      price=$8
                  where id = $9`,
                [title, genre, studioId, director, actors, year, annotation, price, id]
            );
        } catch (e) {
            res.send(500, e.message);
        } finally {
            res.send(200, 'OK')
            client.release();
        }


    }

    async deleteFilm(req, res) {
        const filmId = req.params.id;
        const client = await db.connect();
        try {
            await client.query(
                `
                    delete
                    from films
                    where id = $1;
                `,
                [filmId]
            )
        } catch (e) {
            res.send(500, e.message);
        } finally {
            res.send(200, 'OK')
            client.release();
        }
    }

    async getFilmsList(req, res) {
        const client = await db.connect();
        try {
            const filmsList = await client.query(
                `select *
                 from films`,
                []);
            res.send(200, filmsList.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }
    }


}


module.exports = new FilmsController();