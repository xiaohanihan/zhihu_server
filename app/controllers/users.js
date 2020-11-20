const User = require('../models/users')

const userList = [
    {name: '小红'}
]

class UserController{
    findUsers = async (ctx) => {
        ctx.body = await User.find().select('+password')
    }

    findUserById = async (ctx) => {
        const user = await (await User.findById(ctx.params.id)).select('+password')
        if(null == user){
            ctx.throw(404, '未找到用户')
        }
        ctx.body = user;
    }

    addUser = async (ctx) => {
        ctx.verifyParams({
            account: {type: 'string', required: true},
            password: {type: 'string', required: true},
            nickName: {type: 'string', required: true},
        })

        const user = await new User(ctx.request.body).save();
        ctx.body = user
    }

    updateUser = async (ctx) => {
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(null == user){
            ctx.throw(404, '未找到用户')
        }
        ctx.body = ctx.request.body
    }

    deleteUser = async (ctx) => {
        const user =  await User.findByIdAndRemove(ctx.params.id);
        if(null == user){
            ctx.throw(404, '用户不存在')
        }
        ctx.status = 204;
    }
}

module.exports = new UserController();