const Errors = require('../exceptions.js')
const Log = require('../runtime/log.js')

module.exports = async (ctx, next) => {
    try {
        // 执行下一个中间件
        await next();
    } catch (err) {

        /**
         * 1. 错误分类
         * 2. 记录意料外的错误
         */
        if (err instanceof Errors.BaseError){ // 自定义错误
            ctx.status = err.status;
            ctx.body = err;
        } else { // 意外错误
            // 记录错误日志
            Log.witre_error_log(err, ctx);
            
            const error = new Errors.ServerError();
            ctx.status = error.status;
            ctx.body = error;
        }
        


    }
}