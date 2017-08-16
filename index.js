const DBModel = require('./model');
const connection = require('./util/connection');

const connectHelper = {
    initDB: connection.initDB
};

module.exports = {
    DBModel,
    connectHelper
};
