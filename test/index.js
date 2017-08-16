/**
 * Created by gukong on 2017/8/15.
 */

const {DBModel, connectHelper} = require('../index');
const schemal = require('./schema');

connectHelper.initDB('mongodb://localhost:25916/db_helper', true);

// point to collection
const model = new DBModel('waiter', schemal);

// update collection
model.newDoc({serviceId: '556'});
// model.archive({serviceId: '556'});