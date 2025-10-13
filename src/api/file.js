const fs = require('fs')
const path = require('path')
const { FileNameReError, PathMissError } = require('../exceptions.js')
const config = require('../config.json')
const save_path = config.dirConfigSavePath

// 根据用户信息, 获取用户的配置信息路径
const getConginPathByUser = user => path.resolve(save_path, `./${user.user_name}.json`)


/**
 * 根据用户传入的信息, 初始化用户的配置信息
 * @param {Object} user 
 */
const init_user_config = user  => {
    const file_path = getConginPathByUser(user)
    const config = '[]'
    fs.writeFileSync(file_path, config, {flag: 'w+'})
}


/**
 * 根据路径获取对应的文件夹对象 
 * @param {String} dir      // 待创建路径
 * @param {Object} config   // 用户的配置信息
 */
const get_dir_by_path = (dir, config) => {
    const dir_list = dir.split('/').filter(d => d.trim())
    
    let cur = config
    dir_list.forEach(d=> {
        const parent_dir_config = config.find(c => c.name === d)
        if (!parent_dir_config) throw new PathMissError(`路径错误, ${d}文件夹不存在`)
        cur = parent_dir_config.childran
    })
    
    return cur
    
}


/**
 * @description 文件接口
 */
module.exports =  class File{

    /**
     * 创建文件
     * @param {Object} user      // 用户信息
     * @param {String} dir_name  // 新建文件夹名称
     * @param {String} tag       // 文件夹目标路径
     */
    static mkdir(user, dir_name, tag = '/'){
        const user_config = JSON.parse(this.get_config_by_user(user))
        let parent = user_config

        // 判断tag是否为根目录
        if (tag !== '/') parent = get_dir_by_path(tag, parent)

        //  判断同级目录之下, 是否存在同名文件夹
        const same_level_dir = parent.find(d => d.name === dir_name)
        if(same_level_dir) throw new FileNameReError(`${dir_name}文件夹已存在`)

        // 创建文件夹信息并保存
        const dir = { name: dir_name, childran: [] }
        parent.push(dir) // 由于语言特性这里的修改会影响到 user_config
        this.save_user_config(user, user_config) 

        return {
            path: path.join(tag, dir_name)
        }
    }


    /**
     * 获取用户的七牛云配置信息
     * @param {Object} user     // 用户信息
     */
    static get_config_by_user(user){
        try {
            const file_path = getConginPathByUser(user)
            return fs.readFileSync(file_path) 
        } catch (error) {
            init_user_config(user)
            return this.get_config_by_user(user)
        }
        
    }


    /**
     * 保存用户的七牛云配置信息
     * @param {Object} user     // 用户信息
     * @param {Object} config   // 用户的目录配置信息
     */
    static save_user_config(user, config){
        const file_path = getConginPathByUser(user)
        fs.writeFileSync(file_path, JSON.stringify(config), {flag: 'w+'})
    }
}