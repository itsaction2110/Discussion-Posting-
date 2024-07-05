require('dotenv').config();

module.exports = {
    mysql: {
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT,
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        debug: false,
      }
}