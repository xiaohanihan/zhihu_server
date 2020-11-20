class HomeController{
    index = (ctx) => {
        ctx.body = 'Hello Node Koa'
    }
}

module.exports = new HomeController()