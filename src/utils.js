const fs = require('fs')
const path = require('path')



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

module.exports = {
    fillerZero, touchPath
}