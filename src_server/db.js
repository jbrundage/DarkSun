const mongo = require('mongoose');

const temp = {
    users: {
        username:   {type: String, required:true, unique: true},
        email:      {type: String},
        password:   {type: String, required:true},
        created:    {type: Date,   default: Date.now},
        updated:    {type: Date,   default: Date.now},
        accessed:   {type: Date,   default: Date.now},
        session:    {type: String},
    },
    sessions: {
        key:        {type: String, required:true},
        json:       {type: String, required:true},
        created:    {type: Date} 
    }
};
let ret = {}; 
ret.json = {}; 
Object.keys(temp).forEach(function(name,i){ /* create json db schema for client-side use */
    ret.json[name] = {};
    Object.keys(temp[name]).forEach(function(paramName,i2){
        ret.json[name][paramName] = JSON.parse(JSON.stringify(temp[name][paramName]));
        ret.json[name][paramName].type = temp[name][paramName].type === String ? "string" : "";
        ret.json[name][paramName].type = temp[name][paramName].type === Number ? "number" : ret.json[name][paramName].type;
        ret.json[name][paramName].type = temp[name][paramName].type === Date ? "date" : ret.json[name][paramName].type;
    });
});
ret.users = mongo.model('users', new mongo.Schema(temp.users));
ret.sessions = mongo.model('sessions', new mongo.Schema(temp.users));

module.exports = ret;