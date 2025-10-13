const fs = require('fs')
const path = require('path')
const hash = require('js-sha1')
const { ParamError  } = require('../exceptions.js')
const Token = require('./token.js')

const DBUserPath = path.resolve(__dirname, '../DB/user_info.json')
const DBUser = require(DBUserPath)

const hash_s = '喵喵喵' // 加盐



module.exports =  class UserService {
    /**
     * 用户注册
     * @param {String} user_name        用户名
     * @param {String} password         密码
     * @param {String} repeat_password  重复密码 
     */
    static register(user_name, password, repeat_password) {
        // 参数校验
        this.chekc_user_name(user_name)
        this.chekc_password(password)
        this.chekc_repeat_password(password, repeat_password)

        // 检测用户是否存在
        this.hash_user_name(user_name)

        // 写入数据库
        this.insert_db_user(user_name, this.hash_password(password))

        return '用户注册成功'
    }


    /** 
     * 用户登录
     * @param {String} user_name        用户名
     * @param {String} password         密码
     */
    static login(user_name, password) {
        // 参数校验
        this.chekc_user_name(user_name)
        this.chekc_password(password)
        
        // 查找用户
        const user = DBUser.find(u => u.user_name === user_name)  

        // 判断用户信息是否正确
        if(!user) throw new ParamError(`${user_name}用户不存在`)
        if(user.password !== this.hash_password(password)) throw new ParamError('密码错误')
        
        const sign = Token.create_sign(user)
        return {user, sign}
    }

    /**
     * 检测用户名是否符合规范
     * @param {String} user_name  
     */
    static chekc_user_name(user_name) {
        if(!user_name) throw new ParamError('用户名不能为空')
        if(!/^[a-zA-Z]\w{2,7}/.test(user_name)) throw new ParamError('用户名不规范 长度必为3-8位 以字母开头 只能包含数字字母下划线字符, 仅支持 字母 下划线 数字')
    }

    /** 
     * 检测密码是否符合规范
     * @param {String} password 密码 
     */
    static chekc_password(password) {
        if(!password) throw new ParamError('密码不能为空')
        if(!/^[\w|$|#|@|\.|\*]{5,17}$/.test(password)) throw new ParamError('密码不规范 长度必为6-18位 只能包含数字字母下划线字符, 仅支持 字母 下划线 数字 $ # @ . *')
    }

    /** 
     * 检测两次输入的密码是否一致
     * @param {String} password        密码 
     * @param {String} repeat_password 重复密码
     */
    static chekc_repeat_password(password, repeat_password) {
        if (password !== repeat_password) throw new ParamError('两次输入的密码不一致')
    }

    /** 
     * 密码加密
     * @param {String} password 密码 
     * @returns 加密后的密码
     */
    static hash_password(password) {
        return hash(password + hash_s)
    }

    /**
     * 检测用户是否存在
     * @param {String} user_name    用户名 
     */
     static hash_user_name(user_name) {
        const user = DBUser.find(u => u.user_name === user_name)
        if (user) throw new ParamError('用户名重复')
    }

    /**
     * 用户数据写入数据库
     * @param {String} user_name    用户名 
     * @param {String} password     密码
     */
    static insert_db_user(user_name, password, id) {
        DBUser.push({user_name, password, id: DBUser.length})
        // 将用户信息写入数据库
        fs.writeFileSync(DBUserPath, JSON.stringify(DBUser))
    }

}