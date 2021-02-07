const db = require('../db');

class AuthorityController {

    async createAuthority(req, res) {
        const {authorityName} = req.body;
        const client = await db.connect();
        const authorityWithSameName = await client.query(`
                    select *
                    from authorities
                    where authority = $1`,
            [authorityName]
        );
        if (!authorityWithSameName.rows.length) {
            try {
                const authority = await client.query(`
                            insert into authorities (authority)
                            values ($1) returning *`,
                    [authorityName]
                );
                res.send(200, authority.rows[0]);

            } catch (e) {
                res.send(500, e.message);
            } finally {
                client.release();
            }

        } else {
            res.send(500, 'Данные права уже существуют');
        }
    }

    async deleteAuthority(req, res) {
        const authorityId = req.params.id;
        const client = await db.connect();
        try {
            await client.query(
                `
                    delete
                    from authorities
                    where id = $1;
                `,
                [authorityId]
            )
        } catch (e) {
            res.send(500, e.message);
        } finally {
            res.send(200, "OK")
            client.release();
        }
    }

    async getAuthoritiesList(req, res) {
        const client = await db.connect();
        try {
            const authoritiesList = await client.query(
                `select id, authority
                 from authorities`,
                []);
            res.send(200, authoritiesList.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }


    }

    async updateAuthority (req, res) {
        const {authorityId, authority} = req.body;
        const client = await db.connect();
        try {
            await client.query(
                `
                    update authorities
                    set authority =$1
                    where id = $2
                `,
                [authority, authorityId]
            )
        } catch (e) {
            res.send(500, e.message);
        } finally {
            res.send(200, 'OK')
            client.release();
        }
    }

}


module.exports = new AuthorityController();