const express = require("express");
const router = express.Router();
const { userValidation } = require('../User');
const bcrypt = require("bcrypt");
const { postgreSQLManager } = require('../manager');
const moment = require('moment');


router.post('/', async (req, res,) => {
    // validate the request body first
    const { error } = userValidation.SaveUser.validateAsync({ ...req.body });
    if (error) return res.status(400).json({ message: error.details[0].message });

    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();

    const exitingUser = await conn.query(`SELECT * FROM "User" WHERE lower("Email") = lower('${req.body.email}')`);
    if (exitingUser.rows.length > 0) return res.status(400).json({ message: "User already registered.", status: false });

    //inserting into db.
    const param = [];
    //converting plain password intp hash string.
    let password = await bcrypt.hash(req.body.password, 10);
    param.push(req.body.name, req.body.email, req.body.mobile, password, moment.utc().format(), moment.utc().format());
    const query = `insert into "User"("Name", "Email", "MobileNo", "Password", "CreatedDate", "UpdatedDate") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    //saving into db.
    try {
        const { rows } = await conn.query(query, param);
        return res.status(200).json({ status: true, message: "User saved successfully.", data: [rows[0]["UserId"]] });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", data: [] });
    }

});

module.exports = router;