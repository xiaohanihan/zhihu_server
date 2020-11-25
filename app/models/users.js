const mongoose = require('mongoose')

const { Schema, model } = mongoose

const UserSchema  = new Schema({
    account: {type: String, required: false},
    password: {type: String, required: true, select: false},
    nickName: {type: String, required: false},
    createdDate: {type: Date, default: new Date()},
    headUrl: {type: String, required: false},
    phone: {type: String, required: false, select: true},
})

module.exports = model('User', UserSchema)