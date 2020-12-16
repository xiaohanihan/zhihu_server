const KoaRouter = require('koa-router')
const { index, upload } = require('../controllers/home')
const router = new KoaRouter();
const jwtAuth = require('../utils/jwtAuth')

router.get('/', index)

/**
 * 上传文件
 */
router.post('/upload',jwtAuth, upload)

module.exports = router;