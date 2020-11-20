const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')
const koaJsonError = require('koa-json-error')
const parameter = require('koa-parameter')
const routing = require('./routes')
const mongoose = require('mongoose')

const app = new Koa();

mongoose.connect('mongodb://127.0.0.1:27017/admin',{ 
    useNewUrlParser: true,
    user: 'root',
    pass: 'root',
    useUnifiedTopology: true
 },() => {console.log('mongoose启动成功')})
mongoose.connection.on('error', console.error)

/**
 * 自己写的错误处理中间件
 */
const dealError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        ctx.status = error.status || error.statusCode || 500;
        ctx.body = {
            message: error.message
        }
    }
}

app.use(koaJsonError({
    postFormat: (e, {stack, ...rest}) => {
        const d = process.env.NODE_ENV === 'DEV'?{stack, ...rest}:rest;
        return d
    }
}))

app.use(parameter(app))
app.use(bodyParser())
routing(app)
app.listen(3000)