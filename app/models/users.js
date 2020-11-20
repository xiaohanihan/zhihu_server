const mongoose = require('mongoose')

const { Schema, model } = mongoose

const UserSchema  = new Schema({
    account: {type: String, required: true},
    password: {type: String, required: true, select: false},
    nickName: {type: String, required: true},
    createdDate: {type: Date, default: new Date()}
})

module.exports = model('User', UserSchema)