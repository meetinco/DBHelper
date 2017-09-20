const DBModel = require('./model');
const connection = require('./util/connection');
const filterUtil = require('./util/doc_filter');

const connectHelper = {
    initDB: connection.initDB
};

module.exports = {
    DBModel,
    connectHelper,
    setFilterProperties: filterUtil.setFilterProperties,
    filterDocument: filterUtil.filterDocument
};
