const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { postgreSQLManager } = require('../manager');
const { LoginBody } = require('./login.validation');
const jwt = require("jsonwebtoken");


router.post('/', async (req, res) => {
    try {
        // validate the request body first
        const { error } = LoginBody.validateAsync({ ...req.body });
        if (error) return res.status(400).json({ message: error.details[0].message });

        //establishing the DB connection
        const conn = await postgreSQLManager.getConnection();

        const exitingUser = await conn.query(`SELECT * FROM "User" WHERE lower("Email") = lower('${req.body.email}')`);
        if (exitingUser.rows.length == 0) return res.status(400).json({ status: false, message: "Invalid UserName & Password." });

        const isPasswordValid = await bcrypt.compare(req.body.password, exitingUser.rows[0]["Password"]);
        if (isPasswordValid) {
            const token = jwt.sign({
                userId: exitingUser.rows[0]["UserId"],
                Name: exitingUser.rows[0]["Name"],
                email: exitingUser.rows[0]["Email"]
            }, process.env.MYPRIVATEKEY, { expiresIn: '1h' })
            return res.status(200).json({ status: true, message: "Login Successful.", token });
        }
        else {
            return res.status(400).json({ status: false, message: "Invalid UserName & Password." });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", data: [] });
    }
});

module.exports = router;