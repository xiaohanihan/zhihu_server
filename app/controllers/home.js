
const path = require('path')
class HomeController {
    index = (ctx) => {
        ctx.body = 'Hello Node Koa'
    }

    upload(ctx) {
        const file = ctx.request.files.image
        const basename = path.basename(file.path)
        ctx.body = { path: `${ctx.origin}/uploads/${basename}` }
    }
    //备注111
}
module.exports = new HomeController()