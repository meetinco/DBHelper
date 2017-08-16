/**
 * Created by gukong on 2017/8/15.
 */
// point to collection
const dbUtils = require('../../util/connection');
const schema = require('./schema');

const archive = dbUtils.createModel('archive-sys', schema);

module.exports = archive;

