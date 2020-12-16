const Koa = require('koa')
const KoaRouter = require('koa-router')
const koaBody = require('koa-body')
const koaJsonError = require('koa-json-error')
const parameter = require('koa-parameter')
const parameterRewrite = require('./utils/koa_paramer_rewrite')
const path = require('path')
const koaStatic = require('koa-static')
const routing = require('./routes')
const mongoose = require('mongoose')
const { mongodbUrl } = require('./config')

const app = new Koa();

mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    user: 'root',
    pass: 'root',
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => { console.log('mongoose启动成功') })
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

app.use(koaStatic(path.join(__dirname, '/public')))
app.use(koaJsonError({
    postFormat: (e, { stack, ...rest }) => {
        const d = process.env.NODE_ENV === 'DEV' ? { stack, ...rest } : rest;
        return d
    }
}))
app.use(parameterRewrite(app))
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true
    }
}))
routing(app)
app.listen(4000)