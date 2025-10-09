const {ParamError, SignMissError} = require('../exceptions.js')
const {signTime, tokenTime} = require('../config.json')
const {touchPath} = require('../utils')
const hash = require('js-sha1')
const fs = require('fs')



const save_path = ['src','runtime', 'sign']
touchPath(save_path.join('/'))
const map_token = new Map() // token缓存

module.exports = class Token{

    /**
     * 通过用户信息创建sign 30天时效性
     * @param {Object} user 用户信息 
     * @returns sign
     */
    static create_sign(user){
        const now = Date.now()
        const sign = hash(user.user_name + now)
        const date = new Date(now + signTime * 1000)
        const ctx = JSON.stringify({time: date.getTime(), user})
        console.log(ctx);
        
        fs.writeFileSync([...save_path, sign].join('/'), ctx, {flag: 'w'})


        return sign
    }



    /**
     * 通过sign获取token 2小时时效性
     * @param {String} sign 用户的sign
     * @returns token
    */
    static get_token(sign){
        if (!sign) throw new ParamError('sign不能为空')
        const now = Date.now()
        try {
            // 读取sign信息
            const sign_data = JSON.parse(fs.readFileSync([...save_path, sign].join('/'), {encoding: 'utf-8'}))
            if (now > sign_data.time) throw new SignMissError()
            const user = sign_data.user
            const token_key = hash(user.user_name + now)

            // 创建并存储token
            const token_date = {time: now + tokenTime * 1000, user}
            map_token.set(token_key, token_date)

            return {token: token_key, time: token_date.time}

            
        } catch (error) {
            throw new SignMissError()
        }

        
    }

}
