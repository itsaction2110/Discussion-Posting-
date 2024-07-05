const config = require('../config');
const pgManager = require('../../libs/managers');

//
const postgreSQLManager = pgManager(config.mysql);

module.exports = {
    postgreSQLManager
}