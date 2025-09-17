const {signTime} = require('../config.json')
const hash = require('js-sha1')
const fs = require('fs')
const {touchPath} = require('../utils')

const save_path = ['src','runtime', 'sign']
touchPath(save_path.join('/'))

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
        const ctx = JSON.stringify({time: date.getTime()})

        fs.writeFileSync([...save_path, sign].join('/'), ctx, {flag: 'w'})


        return sign
    }
}
