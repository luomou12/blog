const Router = require('koa-router')
const user_router = require('./user.js')
const qiniu_router = require('./qiniu.js')


const router = new Router({
    prefix: '/api'  // 路由前缀
})

router.use(user_router.routes()) // 挂载用户路由
router.use(qiniu_router.routes()) // 挂载七牛云路由

// 导出路由
module.exports = app => {
    app.use(router.routes()).use(router.allowedMethods())
}