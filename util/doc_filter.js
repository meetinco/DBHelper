/**
 * Created by gukong on 2017/8/14.
 */
const filterConfig = {
    filterPropertys: []
}

function filterDocument(doc, dropPropertyNames) {
    if (!doc) {
        return doc;
    }
    if (doc instanceof Date) {
        return doc;
    }
    if (Array.isArray(doc)) {
        return doc.map(item => filterDocument(item, dropPropertyNames));
    }
    if (!dropPropertyNames) {
        dropPropertyNames = [];
    }
    if (typeof doc.toJSON === 'function') {
        doc = doc.toJSON();
    }
    for (let i = dropPropertyNames.length - 1; i >= 0; i--) {
        delete doc[dropPropertyNames[i]];
    }

    for (const key in doc) {
        if ((key === 'createdAt' || key === 'updatedAt') && doc.hasOwnProperty(key)) {
            doc[key] = new Date(doc[key]).getTime();
        }
        if (!doc.hasOwnProperty(key)) {
            continue;
        }
        const value = doc[key];
        if (Array.isArray(value)) {
            doc[key] = value.map(item => filterDocument(item, dropPropertyNames));
        } else if (value instanceof Object) {
            doc[key] = filterDocument(value, dropPropertyNames);
        }
    }
    return doc;
}

module.exports = {
    filterDocument: (doc) => {
        return filterDocument(doc, filterConfig.filterPropertys)
    },
    setFilterProperties: (filters) => {
        filterConfig.filterPropertys = filters;
    }
};