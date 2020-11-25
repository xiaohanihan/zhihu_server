const KoaRouter = require('koa-router')
const { index, upload } = require('../controllers/home')

const router = new KoaRouter();


router.get('/', index)

/**
 * 上传文件
 */
router.post('/upload', upload)

module.exports = router;