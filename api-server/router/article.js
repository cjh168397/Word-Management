const express = require('express')
const router = express.Router()
// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article')
// 发布新文章
router.post('/add', article_handler.addArticle)
router.post('/list', article_handler.getArticleContent)

router.get('/info/:title', article_handler.deleteArtilce)



module.exports = router