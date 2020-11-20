const KoaRouter = require('koa-router')
const { findUsers, findUserById, addUser, updateUser, deleteUser } = require('../controllers/users')

const userRouter = new KoaRouter({ prefix: '/users' })

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
userRouter.put('/:id', updateUser)

/**
 * 删除用户
 */
userRouter.delete('/:id', deleteUser)

module.exports = userRouter;

