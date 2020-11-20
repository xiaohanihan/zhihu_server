const fs = require('fs')

// 读取当前目录下的文件
const files = fs.readdirSync(__dirname);

const routing = app => {
    files.forEach(file => {
        if (file === 'index.js') { return; }
        const oneRoute = require(`./${file}`);
        app.use(oneRoute.routes()).use(oneRoute.allowedMethods())
    })
}

module.exports = routing;