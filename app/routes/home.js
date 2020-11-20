const KoaRouter = require('koa-router')
const { index } = require('../controllers/home')

const router = new KoaRouter();


router.get('/', index)

module.exports = router;