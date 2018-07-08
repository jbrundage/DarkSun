const express = require('express');
const mongo = require('mongoose');
const crypto = require('crypto');

const auth_db = require('./auth_db');

module.exports = {
    "generate_key": _=>{
        const sha = crypto.createHash('sha256');
        sha.update(Math.random().toString());
        const session_key = sha.digest('hex');
        return session_key;
    },
    "check_session_state": (session_key,callback)=>{
        console.info(`session_key`,session_key);
        auth_db.sessions.find({
            key: session_key
        })
        .then((session_document) => {
            console.info(`session_document`,session_document);
            if(session_document){
                callback(session_document);
            } else {
                console.log("session not found");
            }
        })
        .catch((resp) => {
            console.log(resp)
        });
    }
};