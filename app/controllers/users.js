const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const {
    secret
} = require('../config')

const userList = [{
    name: '小红'
}]
// 备注22
class UserController {

    async checkRight(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }

    findUsers = async (ctx) => {
        ctx.body = await User.find().select('+password')
    }

    findUserById = async (ctx) => {
        const user = await (await User.findById(ctx.params.id)).select('+password')
        if (null == user) {
            ctx.throw(404, '未找到用户')
        }
        ctx.body = user;
    }

    addUser = async (ctx) => {
        ctx.verifyParams({
            password: {
                type: 'string',
                required: true
            },
        })
        // 校验参数是否有手机号或者账号
        if (!ctx.request.body.account && !ctx.request.body.phone) {
            ctx.throw(409, '参数不全：缺少账号或者手机号')
        }

        const {
            account,
            nickName,
            phone
        } = ctx.request.body;
        // 校验账号是否存在
        if (account) {
            const user = await User.findOne({
                account
            })
            if (user) {
                ctx.throw(409, '账号已注册')
            }
        }
        // 校验手机号是否存在
        if (phone) {
            const user = await User.findOne({
                phone
            })
            if (user) {
                ctx.throw(409, '手机号已注册')
            }
        }

        // 校验昵称是否存在
        const user2 = await User.findOne({
            nickName
        });
        if (user2) {
            ctx.throw(409, '昵称已存在')
        }

        const user3 = await new User(ctx.request.body).save();
        if (!user3.nickName) {
            const id = user3._id.toString();
            user3.nickName = id.substring(id.length - 7, id.length - 1) + '_bibilili'
            user3.save()
        }
        ctx.body = user3
    }

    updateUser = async (ctx) => {
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (null == user) {
            ctx.throw(404, '未找到用户')
        }
        ctx.body = ctx.request.body
    }

    deleteUser = async (ctx) => {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if (null == user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.status = 204;
    }

    /**
     * 用户登录
     */
    login = async (ctx) => {
        ctx.verifyParams({
            account: {
                type: 'string',
                required: true,
                message: '请输入账号！'
            },
            password: {
                type: 'string',
                required: true,
                message: '请输入密码！'
            }
        })

        const {
            account,
            password
        } = ctx.request.body;
        // 验证用户名密码是否正确
        const user = await User.findOne({
            account,
            password
        })
        if (!user) {
            ctx.throw(401, '用户名或者密码不正确')
        }
        // 签名获取token
        const {
            _id
        } = user
        const token = jsonwebtoken.sign({
            _id,
            account
        }, secret, {
            expiresIn: '1d'
        })
        ctx.body = {
            user,
            token
        }
    }

    /**
     * 根据用户token获取用户信息
     */
    async findUserByToken(ctx) {
        const {
            token
        } = ctx.params;
        try {
            const {
                _id
            } = jsonwebtoken.verify(token, secret);
            // 根据id去数据库查询用户信息
            const user = await User.findById(_id);
            if (!user) {
                ctx.throw(401, '请重新登录')
            }
            ctx.body = user;
        } catch (error) {
            ctx.throw(401, error.message)
        }

    }
}

module.exports = new UserController();