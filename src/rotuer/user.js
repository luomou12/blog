const Router = require('koa-router');
const UserService = require('../api/user.js')
const Token = require('../api/token.js')


const user_router = new Router({
    prefix: '/user/'
})


// 注册
user_router.post('register', (ctx) => {
    const {user_name, password, repeat_password} = ctx.request.body
    return UserService.register(user_name, password, repeat_password)
})


// 登录
user_router.post('login', (ctx) => {
    const {user_name, password} = ctx.request.body
    const {user, sign} = UserService.login(user_name, password)

    console.log(user, sign)

    return {user, sign}
})

// token颁发 sign时效性长   
user_router.get('token', (ctx) => {
    const sign = ctx.request.query.sign
    const token = Token.get_token(sign)

    return token
})


module.exports = user_router