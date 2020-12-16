/**
 * jwt校验的中间件
 */
const jwt = require('koa-jwt')
const { secret } = require('../config')
const jwtAuth = jwt({ secret })

module.exports = jwtAuth;