const express = require('express');
const mongo = require('mongoose');
const crypto = require('crypto');

const auth_db = require('./auth_db');

let ret = {
    "generate_key": _=>{
        const sha = crypto.createHash('sha256');
        sha.update(Math.random().toString());
        const session_key = sha.digest('hex');
        return session_key;
    },
    "session_handshake": (session_key,callback)=>{
        auth_db.sessions.find({
            key: session_key
        })
        .then(callback)
        .catch((resp) => {
            console.error(resp)
        });
    }
};
ret["get_user_session"] = (username, password, callback)=>{
    auth_db.users.find({username: username, password: password})
    .then((user_doc_arr) => {
        if(user_doc_arr.length === 1){
            auth_db.sessions.find({username: username})
            .then((session_doc_arr) => {
                if(session_doc_arr.length === 1) {
                    callback(session_doc_arr);
                } else {
                    const session_key = ret.generate_key();
                    const session_doc = {
                        username: username,
                        key: session_key,
                        json: `{}`
                    };
                    new auth_db.sessions(session_doc).save().then(console.log).catch(e=>console.log(e))
                    callback(session_doc);
                }
            })
            .catch(resp=>console.log(resp));
        } else {
            callback({error: "Invalid login info..."});
        }
    })
    .catch(resp=>console.log(resp));
};
module.exports = ret;