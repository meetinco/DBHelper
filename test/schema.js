/**
 * Created by gukong on 2017/7/5.
 */
const mongoose = require('mongoose');

// 数据版本号，数据更新时需要更新版本号
exports.DATA_VERSION = 1;

const personShema = new mongoose.Schema({
    services: [{
        name: String,
        count: Number
    }],
    serviceId: String,
    waiter: {
        waiterId: String,
        name: String,
        avatar: String,
        number: Number
    },
    customerId: String,
    serviceStatus: Number,
    table: {
        name: String,
        tableId: String,
        tableIndex: String
    },
    shopId: String,

    dataVersion: {type: Number, default: exports.DATA_VERSION}, // 数据版本号
});
// 增加创建和修改日期字段
personShema.set('timestamps', true);

module.exports = personShema;
