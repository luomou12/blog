const Router = require('koa-router');
const UserService = require('../api/user.js')

const user_router = new Router({
    prefix: '/api/user/'
})


user_router.post('register', (ctx) => {
    const {user_name, password, repeat_password} = ctx.request.body
    return UserService.register(user_name, password, repeat_password)
})


user_router.post('login', (ctx) => {
    const {user_name, password} = ctx.request.body
    const {user, sign} = UserService.login(user_name, password)

    console.log(user, sign)

    return {user, sign}
})

// token颁发 sign时效性长   
user_router.get('token', (ctx) => {
    
    return 'token续期'
})


module.exports = user_router