# Usage

### app.js 
init db
```javascript
const connectHelper = require('db-helper').connectHelper;
const dbAddress = '';
const debugMode = true;

connectHelper.initDB(dbAddress, debugMode);
```

### db/model.js
custom db model
```javascript
const DBModel = require('db-helper').DBModel;
const schema = require('./schema'); // You have to create a schema.js. See below.

class PersonModel extends DBModel {
    constructor() {
        const dbName = 'person';
        super(dbName, schema);
    }
} 
module.exports = new PersonModel();
```

### db/schema.js
define your schema
```javascript
const mongoose = require('mongoose');

// 数据版本号，数据更新时需要更新版本号
exports.DATA_VERSION = 1;

const personShema = new mongoose.Schema({

    personId: String,
    name: String,
    nickname: String,
    avatar: String,
    gender: Number,
    wxOpenid: String,
    personTypes: Array,
    phone: String,
    waiterInfos: [{
        number: Number,
        shopId: String,
        working: Boolean,
        tables: [{
            tableId: String,
            name: String,
            tableIndex: Number
        }]
    }],

    dataVersion: {type: Number, default: exports.DATA_VERSION}, // 数据版本号
});
// 增加创建和修改日期字段
personShema.set('timestamps', true);

module.exports = personShema;
```
### manage.js
try to use it
```javascript
const personModel = require('./db/model');
personModel.newDoc({name: 'just a test'})
```