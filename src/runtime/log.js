const { touchPath, fillerZero } = require('../utils.js')
const fs = require('fs')

class Log {
    static witre_error_log(err, ctx){
        const cur_date = new Date();
        const error_text = this.error_to_string_template(err, ctx);
        const log_path = `src/runtime/err_log/${cur_date.getFullYear()}_${fillerZero(cur_date.getMonth() + 1)}`
        // 确保日志目录存在
        touchPath(log_path)

        const log_file_name = `${cur_date.getDate()}.log`
        fs.writeFileSync(`${log_path}/${log_file_name}`, error_text, {flag: 'a+'})

    }

    /**
     * 接受一个错误对象，转换为错误模板
     * @param {Error}       err 错误的实例
     * @param {Koa.Context} ctx 当前访问的请求实例
     */
    static error_to_string_template(err, ctx ){
        const cur_date = new Date();
        const date_str = [cur_date.toLocaleTimeString(), Date.now()].join(" ")
        return`
错误时间: ${date_str};
请求方式: ${ctx.request.method};
请求地址: ${ctx.request.url};
错误信息: ${err.message};
错误堆栈: ${err.stack};
 `
    }
}

module.exports = Log;