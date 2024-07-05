const { postgreSQLManager } = require('../manager');
const moment = require('moment');


const SavePost = async (description, hashtag, image, userId) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const param = [];
    const columns = [];
    if (description != undefined) {
        columns.push('"Description"');
        param.push(description);
    }
    if (hashtag != undefined) {
        columns.push('"HashTag"');
        param.push(hashtag);
    }
    if (image != undefined) {
        columns.push('"Image"');
        param.push(image);
    }

    param.push(moment.utc().format(), moment.utc().format(), userId, userId);
    const query = `INSERT INTO "Post"(${columns.join(', ')}, "CreatedDate", "UpdatedDate", "CreatedBy", "UpdatedBy") VALUES (${param.map((_, index) => `$${index + 1}`).join(', ')}, uuid_nil(), uuid_nil()) RETURNING *`;

    try {
        const { rows } = await conn.query(query, param);
        return { status: true, message: "Post saved successfully.", data: [rows[0]["PostId"]] };
    } catch (err) {
        return { status: false, message: "Error while saving post.", data: [] };
    }

};

const UpdatePost = async (postId, description, hashtag, image, userId) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const param = [];
    const whereArray = [];
    const setArray = [];
    let i = 1

    if (description != undefined) {
        setArray.push(`"Description" = $${i}`);
        param.push(description);
        i++;
    }
    if (image != undefined) {
        setArray.push(`"Image" = $${i}`);
        param.push(image);
        i++;
    }
    if (postId != undefined) {
        whereArray.push(`"PostId" = $${i}`);
        param.push(postId);
        i++;
    }
    setArray.push(`"UpdatedDate" = $${i}`);
    param.push(moment.utc().format());
    i++;

    setArray.push(`"UpdatedBy" = $${i}`);
    param.push(userId);
    i++;

    const whereString = whereArray.length > 0 ? ` WHERE ${whereArray.join(' AND ')}` : '';
    const setString = setArray.length > 0 ? ` SET ${setArray.join(',')}` : '';

    const query = `Update "Post" ${setString} ${whereString} returning *`;

    await conn.query('BEGIN');
    try {
        const { rows } = await conn.query(query, param);
        const data = rows[0]["PostId"];
        await conn.query('COMMIT');
        return { status: true, message: "Post updated successfully.", data };
    } catch (er) {
        await conn.query('ROLLBACK');
        return { status: false, message: "Post update failed.", data: [] };
    }
};

const GetPostList = async (searchString, searchByHashtag) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const whereArray = [];
    let searchParam = '';
    let i = 1;
    if (searchString != undefined) {
        searchParam += ` AND p."Description" LIKE '%${searchString}%'`
    }
    if (searchByHashtag != undefined) {
        searchParam += ` AND p."HashTag" LIKE '%${searchByHashtag}%'`
    }
    whereArray.push('p."IsActive" = true');
    const whereString = whereArray.length > 0 ? ` WHERE ${whereArray.join(' AND ')}` : '';

    const query = `SELECT * FROM "Post" p ${whereString} ${searchParam}`;

    const { rows } = await conn.query(query);
    const response = {};
    if (rows.length > 0) {
        response.status = true;
        response.Data = rows;
    } else {
        response.status = false;
        response.Data = "Data not found.";
    }

    return response;
};

const DeletePost = async (postId, userId) => {
    //establishing the DB connection
    const conn = await postgreSQLManager.getConnection();
    const param = [];
    const whereArray = [];
    const setArray = [];
    let i = 1;

    const exitingPost = await conn.query(`SELECT * FROM "Post" WHERE "PostId" = '${postId}'`);
    if (exitingPost.rows.length > 0) {

        if (postId) {
            whereArray.push(`"PostId" = $${i}`);
            param.push(postId);
            i++;
        }
        setArray.push(`"IsActive" = false`);
        setArray.push(`"UpdatedDate" = $${i}`);
        param.push(moment.utc().format());
        i++;

        setArray.push(`"UpdatedBy" = $${i}`);
        param.push(userId);
        i++;

        const setString = setArray.length > 0 ? ` SET ${setArray.join(',')}` : '';
        const whereString = whereArray.length > 0 ? ` WHERE ${whereArray.join(' AND ')}` : '';

        const query = `UPDATE "Post" ${setString} ${whereString}`;
        //executing query, updating post in the database.
        const { rows } = await conn.query(query, param);

        return { status: true, message: "Post deleted successfully.", data: [] };
    } else {
        return { status: false, data: 'Post not found' };
    }
};

module.exports = {
    SavePost,
    UpdatePost,
    GetPostList,
    DeletePost
};