const authCodes = require('../auth_codes');
const bcrypt = require('bcrypt');
const db = require('../db');

class UserController {
    async createUser(req, res) {

        const {
            username,
            password,
            firstName,
            lastName,
            middleName,
            series,
            number,
            city,
            street,
            house,
            phone
        } = req.body;

        const client = await db.connect();

        const userWithSameUsername = await client.query(`
                    select *
                    from users
                    where username = $1`,
            [username]);

        if (!userWithSameUsername.rows.length) {

            try {
                client.query('BEGIN');
                try {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const user = await client.query(
                        `insert into users (username, password, authority_id)
                         values ($1, $2, $3) returning *`,
                        [username, hashedPassword, authCodes['client']]
                    );

                    const passport = await client.query(
                        `insert into passports (first_name, last_name, middle_name, series,
                                                number, city, street, house, phone, user_id)
                         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [firstName, lastName, middleName, series, number, city, street, house, phone, user.rows[0].id]
                    );
                    client.query('COMMIT');
                } catch (e) {
                    console.log(e.message);
                    client.query('ROLLBACK');
                    res.send(500, e.message);
                }

            } finally {
                client.release();
            }
            res.send(200, 'OK');
        } else {
            res.send(401, 'Данный логин уже занят.');
        }
    }

    async login(req, res) {
        const {username, password} = req.body;
        const client = await db.connect();
        try {
            let userInfo = await client.query(
                `select password, authority_id, id
                 from users
                 where username = $1`,
                [username]
            );
            userInfo = userInfo.rows[0];

            if (userInfo) {
                if (await bcrypt.compare(password, userInfo.password)) {

                    let userAuthority = await client.query(
                        `select *
                         from authorities
                         where id = $1`,
                        [userInfo['authority_id']]
                    );
                    userAuthority = userAuthority.rows[0];
                    res.send(200, {authority:userAuthority, user: {userId: userInfo.id}});

                } else {
                    res.send(401, 'Not allowed');
                }

            } else {
                res.send(500, 'No such user');
            }

        } catch (e) {
            console.log(e.message);
            res.send(500, e.message);
        } finally {
            client.release()
        }

    }

    async getUsers(req, res) {
        const client = await db.connect();
        try {
            const usersList = await client.query(
                `select id, username, authority_id
                 from users`,
                []);
            res.send(200, usersList.rows);
        } catch (e) {
            res.send(500, e.message);
        } finally {
            client.release();
        }
    }

    async updateUser(req, res) {
        const {userId, authorityId} = req.body;
        const client = await db.connect();
        try {
            const updatedUserInfo = await client.query(
                `update users
                 set authority_id =$1
                 where id = $2 returning id,  username ,authority_id `,
                [authorityId, userId]
            );
            res.send(200, updatedUserInfo.rows[0])
        } catch (e) {
            res.send(500, e.message)
        } finally {
            client.release()
        }

    }

    async updatePassportInfo(req, res) {
        const {city, firstName, lastName, middleName, series, number, street, house, phone, userId} = req.body;
        const client = await db.connect();
        try {
            const updatedPassportInfo = await client.query(
                `update passports
                 set city=$1,
                     first_name=$2,
                     last_name=$3,
                     middle_name=$4,
                     series=$5,
                     number=$6,
                     street=$7,
                     house=$8,
                     phone=$9
                 where user_id = $10 returning *`,
                [city, firstName, lastName, middleName, series, number, street, house, phone, userId]
            );
            res.send(200, updatedPassportInfo.rows[0])
        } catch (e) {
            res.send(500, e.message)
        } finally {
            client.release()
        }


    }

    async deleteUser(req, res) {
        const userId = req.params.id
        const client = await db.connect();

        try {

            client.query('BEGIN');

            try {
                await client.query(
                    `delete
                     from passports
                     where user_id = $1`,
                    [userId]
                );
                await client.query(
                    `
                        delete
                        from users
                        where id = $1
                    `, [userId]
                )

                client.query('COMMIT');
                res.send(200, "OK")

            } catch (e) {
                console.log(e.message);
                client.query('ROLLBACK');
                res.send(500, e.message);
            }


        } finally {
            client.release();
        }

    }

}

module.exports = new UserController();

