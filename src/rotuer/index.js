const user_router = require('./user.js')


module.exports = app => {
    /* 用户路由 */
    app.use(user_router.routes()).use(user_router.allowedMethods())
    
}