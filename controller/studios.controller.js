const db = require('../db');

class StudiosController {

    async createStudio(req, res) {
        const {name, country} = req.body;
        const client = await db.connect();
        const studioWithSameName = await client.query(`
                    select *
                    from studios
                    where name = $1`,
            [name]
        );

        if (!studioWithSameName.rows.length) {
            try {
                const studio = await client.query(`
                            insert into studios (name, country)
                            values ($1, $2) returning *`,
                    [name, country]
                );
                res.send(200, studio.rows[0]);


            } catch (e) {
                res.send(500, e.message);
            } finally {
                client.release();
            }
        } else {
            res.send(500, 'Студия с таким именем уже существует')
        }


    }

    async getStudiosList(req, res) {
        const client = await db.connect();
        try {
            const studiosList = await client.query(
                `select id, name, country
                 from studios`,
                []);
            res.send(200, studiosList.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }


    }

    async updateStudio(req, res) {
        const {id, name, country} = req.body;
        const client = await db.connect();
        try {
            await client.query(
                ` update studios
                  set name =$1,
                      country=$2
                  where id = $3`,
                [name, country, id]
            );
        } catch (e) {
            res.send(500, e.message);
        } finally {
            res.send(200, 'OK')
            client.release();
        }
    }

}


module.exports = new StudiosController();