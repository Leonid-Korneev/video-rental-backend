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

    


}

module.exports = new LogbookController();