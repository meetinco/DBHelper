/**
 * Created by gukong on 2017/8/14.
 */
const connectionUtils = require('./util/connection');
const gFilterDocument = require('./util/doc_filter').filterDocument;
const MError = require('./util/error');
let archiveManager = null;

/** ********************外露接口************************ */

class DBModel {
    constructor(dbName, schema) {
        this.model = connectionUtils.createModel(dbName, schema);
    }

    /**
     * 获取分页数据
     * @param query
     * @param sort
     * @param index
     * @param limit
     * @param selectArray
     */
    pagedList(query = {}, selectArray = null, index = 0, limit = 0, sort = {createdAt: -1}) {
        // noinspection JSUnresolvedFunction
        return this.model.find(query)
            .sort(sort)
            .limit(limit)
            .skip(index)
            .select(selectArray ? selectArray.join(' ') : '')
            .exec()
            .catch((error) => {
                throw new MError(MError.Errcode.ACESS_DATABASE_ERROR, error);
            })
            .then(gFilterDocument);
    }

    update(query, changedInfo) {
        return this.model.findOneAndUpdate(query, changedInfo, {new: true})
            .exec()
            .catch((error) => {
                throw new MError(MError.Errcode.ACESS_DATABASE_ERROR, error);
            })
            .then(gFilterDocument);
    }

    create(query, savedDoc) {
        const options = {new: true, upsert: true, setDefaultsOnInsert: true};
        return this.model.findOneAndUpdate(query, savedDoc, options)
            .exec()
            .then(gFilterDocument);
    }

    newDoc(newDoc) {
        return this.model.create(newDoc)
            .then(gFilterDocument);
    }

    remove(query) {
        return this.model.remove(query).exec().then(gFilterDocument);
    }

    archive(query) {
        if (!archiveManager) {
            archiveManager = require('./archive/manager')
        }
        return archiveManager.deleteAndSaveDoc(this.model, query);
    }

    detail(query, selectArray = null) {
        return this.model.findOne(query)
            .select(selectArray ? selectArray.join(' ') : '')
            .exec()
            .catch((error) => {
                throw new MError(MError.Errcode.ACESS_DATABASE_ERROR, error);
            })
            .then((detailInfo) => {
                if (!detailInfo) {
                    return Promise.reject(new MError(MError.Errcode.FIND_NOTHING_IN_DB).setMessageTemplateData(['数据']));
                }
                return gFilterDocument(detailInfo);
            });
    }

    getSum(query = {}) {
        return this.model.count(query)
            .exec()
            .catch((error) => {
                throw new MError(MError.Errcode.ACESS_DATABASE_ERROR, error);
            })
            .then(gFilterDocument);
    }

    /**
     * 正则查找
     * @param {string[]} findFields 查找字段数组
     * @param {string} matchText 匹配文本
     * @param {string[], optional} selectArray 筛选返回字段数组
     */
    searchMultiFields(findFields, matchText, selectArray) {
        const query = {};
        const ORFindExpression = [];
        findFields.forEach((field) => {
            const expression = {};
            expression[field] = new RegExp(matchText, 'i');
            ORFindExpression.push(expression);
        })
        query.$or = ORFindExpression;

        return this.model.find(query)
            .sort({updatedAt: -1})
            .select(selectArray ? selectArray.join(' ') : '')
            .exec()
            .catch((error) => {
                throw new MError(MError.Errcode.ACESS_DATABASE_ERROR, error);
            })
            .then(gFilterDocument);
    }

    aggregate(pipeline) {
        return this.model.aggregate(pipeline)
            .exec()
            .catch((error) => {
                throw new MError(MError.Errcode.ACESS_DATABASE_ERROR, error);
            })
            .then(gFilterDocument);
    }
}

module.exports = DBModel;