const { json } = require('express')
const db = require('../db/index')
// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_articles where title=?`
    // 执行查重操作
    db.query(sql, [req.body.title], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 1 ) return res.cc('文章已发布，请在原文编辑！',req.body.title)
        // 分别判断 分类名称 和 分类别名 是否被占用
        // if (results.length === 1 && results[0].title === req.body.title) return res.cc('分类名 称被占用，请更换后重试！',req.body.name,req.body.alias)
        // if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类 别名被占用，请更换后重试！',req.body.name,req.body.alias)
        // TODO：新增文章分类
        const sql = `insert into ev_articles set ?`
        db.query(sql, req.body, (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('新增文章失败！')
            // 新增文章分类成功
            res.cc('新增文章成功！', 0)
        })
    })
}

// 获取文章列表数据的处理函数
exports.getArticleContent = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    // const sql = 'select * from ev_articles  where is_delete=0 order by id asc'
    let sql = ''
    console.log(req.body.state)
    if(!req.body.cate_id && !req.body.state && !req.body.title){
        console.log('----yes')
        sql = 'SELECT * FROM my_db_01.ev_articles , my_db_01.ev_article_cate , my_db_01.ev_user where my_db_01.ev_user.id = my_db_01.ev_articles.author_id AND ev_articles.is_delete = 0 AND ev_article_cate.id = ev_articles.cate_id  order by ev_articles.id asc'
        db.query(sql, (err, results) => {
            // 1. 执行 SQL 语句失败
                        if (err) return res.cc(err)

            // 2. 执行 SQL 语句成功
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: results,
        
            })
        })
    }else{

        if(req.body.cate_id && !req.body.state )  {
         sql = 'SELECT * FROM my_db_01.ev_articles , my_db_01.ev_article_cate , my_db_01.ev_user where my_db_01.ev_user.id = my_db_01.ev_articles.author_id AND ev_articles.is_delete = 0 AND ev_articles.cate_id = ? AND ev_article_cate.id = ev_articles.cate_id  order by ev_articles.id asc'
         console.log('----no'+ req.body.cate_id)
        
         db.query(sql,req.body
            .cate_id, (err, results) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err)
            // 2. 执行 SQL 语句成功
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: results,
            })
        })
    }
    if(!req.body.cate_id && req.body.state)  {
        sql = 'SELECT * FROM my_db_01.ev_articles , my_db_01.ev_article_cate , my_db_01.ev_user where my_db_01.ev_user.id = my_db_01.ev_articles.author_id AND ev_articles.is_delete = 0 AND ev_articles.state = ? AND ev_article_cate.id = ev_articles.cate_id  order by ev_articles.id asc'
        console.log('----no'+ req.body.state)
       
        db.query(sql,req.body.state, (err, results) => {
           // 1. 执行 SQL 语句失败
           if (err) return res.cc(err)
           // 2. 执行 SQL 语句成功
           res.send({
               status: 0,
               message: '获取文章列表成功！',
               data: results,
           })
       })
   }
   if(req.body.cate_id && req.body.state)  {
    sql = 'SELECT * FROM my_db_01.ev_articles , my_db_01.ev_article_cate , my_db_01.ev_user where my_db_01.ev_user.id = my_db_01.ev_articles.author_id AND ev_articles.is_delete = 0 AND ev_articles.cate_id = ? AND  ev_articles.state = ? AND ev_article_cate.id = ev_articles.cate_id  order by ev_articles.id asc'
    console.log('----no'+ req.body.cate_id,req.body.state)
   
    db.query(sql,[req.body.cate_id, req.body.state] , (err, results) => {
       // 1. 执行 SQL 语句失败
       if (err) return res.cc(err)
       // 2. 执行 SQL 语句成功
       res.send({
           status: 0,
           message: '获取文章列表成功！',
           data: results,
       })
   })
}
if(req.body.title)  {
    sql = 'SELECT * FROM my_db_01.ev_articles , my_db_01.ev_article_cate , my_db_01.ev_user where my_db_01.ev_user.id = my_db_01.ev_articles.author_id AND ev_articles.is_delete = 0 AND ev_articles.title = ? AND ev_article_cate.id = ev_articles.cate_id  order by ev_articles.id asc'
    console.log('----no'+ req.body.title)
   
    db.query(sql,req.body.title , (err, results) => {
       // 1. 执行 SQL 语句失败
       if (err) return res.cc(err)
       // 2. 执行 SQL 语句成功
       res.send({
           status: 0,
           message: '获取文章列表成功！',
           data: results,
       })
   })
}

    }
   
}

// 删除文章分类的处理函数
exports.deleteArtilce = (req, res) => {
    const sql = `update ev_articles set is_delete=1 where title=?`
    console.log('___'+req.params.title)
    db.query(sql, req.params.title, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err,req.params.id)
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章失败！')
        // 删除文章分类成功
        res.cc('删除文章成功！', 0)
    })
}