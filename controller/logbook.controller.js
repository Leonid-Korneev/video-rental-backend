const db = require('../db');

class LogbookController {
    async createLogbook(req, res) {
        const {userId, filmId, issueDate} = req.body;
        const client = await db.connect();


        const logbookWithSameFilm = await client.query(`
                    select *
                    from logbook
                    where film_id = $1
                      and user_id = $2`,
            [filmId, userId]
        );

        if (!logbookWithSameFilm.rows.length) {
            try {

                await client.query(`
                    insert into logbook (film_id, user_id, issue_date)
                    values ($1, $2, $3) returning *
                `, [filmId, userId, issueDate])

            } catch (e) {
                res.send(500, e.message);
            } finally {
                res.send(200, 'OK')
                client.release();
            }


        } else {
            res.send(500, 'У данного пользователя уже есть этот фильм.')
        }


    }

    async updateLogbook(req, res) {
        const {logBookId, filmId, userId, issueDate, returnDate} = req.body;
        const client = await db.connect();
        try {
            await client.query(`
                        update logbook
                        set issue_date  =$1,
                            return_date =$2,
                            film_id=$3,
                            user_id=$4
                        where id = $5
                `,
                [issueDate, returnDate, filmId, userId, logBookId]);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
            res.send(200, 'OK');
        }

    }

    async getUserLogbookList(req, res) {
        const userId = req.params.id;

        const client = await db.connect();
        try {

            const logbooks = await client.query(
                `select *
                 from logbook
                 where user_id = $1`,
                [userId]);
            res.send(200, logbooks.rows);

        } catch (e) {

        } finally {
            client.release();
        }
    }

    async getFullLogbookList(req, res) {
        const client = await db.connect();
        try {

            const logbooks = await client.query(
                `select *
                 from logbook`,
                []);
            res.send(200, logbooks.rows);

        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }
    }
}

module.exports = new LogbookController();