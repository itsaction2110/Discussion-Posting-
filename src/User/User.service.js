const { postgreSQLManager } = require('../manager');
const moment = require('moment');
const bcrypt = require("bcrypt");



const SaveUser = async (name, email, mobile, password) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const param = [];
    //hashing plain password.
    password = await bcrypt.hash(password, 10);
    
    param.push(name, email, mobile, password, moment.utc().format(), moment.utc().format());
    const query = `insert into "User"("Name", "Email", "MobileNo", "Password", "CreatedDate", "UpdatedDate") VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const { rows } = await conn.query(query, param);
    //closing the DB connection
    await conn.end();
    return { status: true, message: "User saved successfully.", data: [rows[0]["UserId"]] };
};

const UpdateUser = async (userId, name, email, mobile) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const param = [];
    const whereArray = [];
    const setArray = [];
    let i = 1

    if (name != undefined) {
        setArray.push(`"Name" = $${i}`);
        param.push(name);
        i++;
    }
    if (email != undefined) {
        setArray.push(`"Email" = $${i}`);
        param.push(email);
        i++;
    }
    if (mobile != undefined) {
        setArray.push(`"MobileNo" = $${i}`);
        param.push(mobile);
        i++;
    }
    if (userId != undefined) {
        whereArray.push(`"UserId" = $${i}`);
        param.push(userId);
        i++;
    }
    setArray.push(`"UpdatedDate" = $${i}`);
    param.push(moment.utc().format());
    i++;

    const whereString = whereArray.length > 0 ? ` WHERE ${whereArray.join(' AND ')}` : '';
    const setString = setArray.length > 0 ? ` SET ${setArray.join(',')}` : '';

    const query = `Update "User" ${setString} ${whereString}`;

    const { rows } = await conn.query(query, param);
    //closing the DB connection
    await conn.end();
    return rows;
};

const GetUserList = async (searchString) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const whereArray = [];
    let searchParam = '';
    let i = 1;
    if (searchString != undefined) {
        searchParam = ` AND u."Name" LIKE '%${searchString}%'`
    }
    whereArray.push('u."IsActive" = true');
    const whereString = whereArray.length > 0 ? ` WHERE ${whereArray.join(' AND ')}` : '';

    const query = `SELECT * FROM "User" u ${whereString} ${searchParam}`;

    const { rows } = await conn.query(query);
    const response = {};
    if (rows.length > 0) {
        response.status = true;
        response.Data = rows;
    } else {
        response.status = false;
        response.Data = "Data not found.";
    }
    //closing the DB connection
    // await conn.end();
    return response;
};

const DeleteUser = async (userId) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const param = [];
    const whereArray = [];
    const setArray = [];
    let i = 1;

    const exitingUser = await conn.query(`SELECT * FROM "User" WHERE "UserId" = '${userId}'`);
    if (exitingUser.rows.length > 0) {

        if (userId) {
            whereArray.push(`"UserId" = $${i}`);
            param.push(userId);
            i++;
        }
        setArray.push(`"IsActive" = false`);

        const setString = setArray.length > 0 ? ` SET ${setArray.join(',')}` : '';
        const whereString = whereArray.length > 0 ? ` WHERE ${whereArray.join(' AND ')}` : '';

        const query = `UPDATE "User" ${setString} ${whereString}`;
        //executing query, updating user in the database.
        const { rows } = await conn.query(query, param);

        return 'User Deleted Succesfully';
    } else {
        return { status: false, data: 'User not found' };
    }
};

module.exports = {
    SaveUser,
    UpdateUser,
    GetUserList,
    DeleteUser
};