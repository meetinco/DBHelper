/**
 * Created by gukong on 2017/8/14.
 */
/**
 * Created by Lnk on 2016/8/22.
 */
const Promise = require('bluebird');
const mongoose = require('mongoose');
const MError = require('./error');
mongoose.Promise = Promise;

// 数据库连接列表，按表分库的时候用到
const connections = [];
const CONN_DEFAULT = 0;
const penddingFunc = [];

/**
 * 初始化数据库
 */
exports.initDB = function initDB(mongoDBAddress, debugMode) {
    // 默认的数据库连接
    connections[CONN_DEFAULT] = createConnection(mongoDBAddress, debugMode);
}

exports.isDebugMode = () => {
    return connections[CONN_DEFAULT].debugMode;
}

/**
 * 创建一个数据库连接
 * @param {string} dbUri 连接地址
 * @param {boolean} debugMode 是否打印数据库操作日志
 * @return {{connected: boolean, db: Connection}}
 */
function createConnection(dbUri, debugMode) {
    const connectionInfo = {
        connected: false,
        db: mongoose.createConnection(dbUri, {
            // 在每次数据更新后自动更新索引，有性能开销
            config: {autoIndex: debugMode}
        }),
        debugMode
    };
    connectionInfo.db.on('error', (e) => {
        console.error(`连接数据库失败: ${e.message}`);
    });
    connectionInfo.db.once('open', () => {
        connectionInfo.connected = true;
        console.log('成功连接到数据库');
        // 建立连接后才开启调试模式，以免连接时显示很多红字提示
        if (debugMode) {
            // mongoose.set('debug', true);
            // use custom function to log collection methods + arguments
            mongoose.set('debug', (collectionName, methodName, ...args) => {
                const argsStr = args.map(arg => JSON.stringify(arg)).join(',');
                console.log(`Mongoose: ${collectionName}.${methodName}(${argsStr})`)
            });
        }
        for (let i = 0; i < penddingFunc.length; i++) {
            penddingFunc[i]();
        }
    });
    connectionInfo.db.once('close', () => {
        connectionInfo.connected = false;
        console.log('断开数据库连接');
    });
    return connectionInfo
}

/**
 * 获取数据表所在的数据库连接
 * @param {string} name 数据表名，dbName.member等
 * @returns {mongoose.connection}
 */
function getConnection() {
    if (!connections.length) {
        throw new MError(MError.Errcode.DATABASE_CONNECTION_NOT_EXIST, 'db connection is not exist');
    }
    return connections[CONN_DEFAULT].db;
};

/**
 * 获取数据表所在的数据库连接
 * @param {string} name 数据表名，dbName.Member等
 * @param {"mongoose".Schema} schema
 * @return {(Statics&_mongoose.ModelConstructor<T>)|*|_mongoose.ModelConstructor<T>}
 */
exports.createModel = function createModel(name, schema) {
    const connection = getConnection();
    return connection.model(name, schema, name);
};

/**
 * 在数据库建立连接后再执行fn
 * @param {Function} fn
 */
exports.onConnected = function onConnected(fn) {
    if (connections.every(connection => connection.connected)) {
        fn();
    } else {
        penddingFunc.push(fn);
    }
}

/**
 * 删除对应字段的index索引
 * @param {string} collectionName 数据集合名字
 * @param {string} rmIndexFiled 删除index的字段名字，可以根据log中的字段获得
 */
exports.rmCollectionIndex = function rmCollectionIndex(collectionName, rmIndexFiled) {
    const keys = Object.keys(exports.dbName);
    if (keys.indexOf(collectionName) < 0) {
        console.error(`carlos error, collection: ${collectionName} not exist`);
        return;
    }
    const tempCollection = getConnection(collectionName).collections[collectionName];
    tempCollection.getIndexes()
        .then((indexs) => {
            console.log(`carlos log, the collection: ${collectionName}, has indexs info: `, JSON.stringify(indexs));
            if (rmIndexFiled) {
                tempCollection.dropIndex(rmIndexFiled);
            }
        });
}
