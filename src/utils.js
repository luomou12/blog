const fs = require('fs')
const path = require('path')
const { PathMissError } = require('./exceptions')


/**
 * 个位数补零
 * @param {Number} n 
 * @returns 字符串
 */
const fillerZero = n => {
    if (n < 10) return '0' + n
    return n.toString()
}

/**
 * 接收一个路径, 如果路径不存在则创建该路径 
 * @param {String} targetPath 
 */
const touchPath = targetPath => {
    const _path = path.resolve(targetPath).split(/\\|\//)
    for(let i = 0; i < _path.length; i++){
        const cur_path = path.join(..._path.slice(0, i + 1))
        try {
            fs.statSync(cur_path)
        } catch {
            fs.mkdirSync(cur_path)
        }
    }
}




/**
 * 根据路径获取对应的文件夹对象 
 * @param {String} dir      // 指定路径
 * @param {Object} config   // 用户的配置信息
 */
const get_dir_by_path = (dir, config) => {
    const dir_list = dir.split('/').filter(d => d.trim())
    let cur = config
    dir_list.forEach(d=> {
        const parent_dir_config = cur.find(c => c.name === d)
        if (!parent_dir_config) throw new PathMissError(`路径错误, ${d}文件夹不存在`)
        cur = parent_dir_config.childran
    })
    
    return cur
}


module.exports = {
    fillerZero, touchPath, get_dir_by_path
}