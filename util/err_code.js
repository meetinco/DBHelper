/**
 * Created by gukong on 2017/8/14.
 */

const code = {
    ACESS_DATABASE_ERROR: {
        code: 20000,
        message: '数据库访问错误'
    },
    DATABASE_CONNECTION_NOT_EXIST: {
        code: 20001,
        message: '数据库还未建立连接'
    },
    PARAMETER_ERROR: {
        code: 20003,
        message: '参数错误'
    },
    FIND_NOTHING_IN_DB:{
        code: 20004,
        message: '该${1}不存在'
    }
};

module.exports = code;