/**
 * Created by gukong on 2017/9/15.
 */
const MError = require('merror-meetin');
const Errcode = require('./err_code');

MError.configErrorCode(Errcode);
MError.Errcode = Errcode;

module.exports = MError;