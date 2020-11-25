const KoaRouter = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
const { findUsers, findUserById, addUser, updateUser, deleteUser, login, checkRight } = require('../controllers/users')
const { secret } = require('../config')

const userRouter = new KoaRouter({ prefix: '/users' })

/**
 * 自己编写的中间件
 * @param {*} ctx 
 * @param {*} next 
 */
const auth = async (ctx, next) => {
    // 获取token
    const { authorization = '' } = ctx.header;
    const token = authorization.replace('Bearer ', '');
    // 验证token
    try {
        const user = jsonwebtoken.verify(token, serect);
        ctx.state.user = user;
    } catch (e) {
        ctx.throw(403, e.message)
    }
    await next()
}

const jwtAuth = jwt({ secret })

userRouter.get('/', findUsers)

/**
 * 获得用户
 */
userRouter.get('/:id', findUserById)

/**
 * 新增用户
 */
userRouter.post('/', addUser)

/**
 * 修改用户
 */
userRouter.put('/:id', jwtAuth, checkRight, updateUser)

/**
 * 删除用户
 */
userRouter.delete('/:id', deleteUser)

/**
 * 登录
 */
userRouter.post('/login', login)

module.exports = userRouter;

