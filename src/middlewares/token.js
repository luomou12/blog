const Token = require('../api/token.js')


// 白名单 不需要验证token的接口
const white_list = ['(\\\/api\\\/user\\\/login)', '(\\\/api\\\/user\\\/register)', '(\\\/api\\\/user\\\/token)']
const reg = new RegExp(`^${white_list.join('|')}`)

/**
 * token中间件验证
 */
module.exports = async (ctx, next) => {
    const url = ctx.request.url
    const token = ctx.request.header.token


    // 非白名单路径需要验证token
    if (!reg.test(url)) {
        const user = Token.verify_token(token).user
        ctx.user = user // 将用户信息存入上下文中，后续接口可用
    }
    
    
    return await next()
}