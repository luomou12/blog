/**
 * 自定义错误基类
 */
class BaseError extends Error {
    // 错误码
    errorCode
    // 自定义错误信息
    message
    // 响应码
    status

    constructor(message = '网络异常', errorCode = '1000', status = 200) {
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.status = status        
    }

    toJSON() {
        return JSON.stringify({
            message: this.message,
            errorCode: this.errorCode
        })
    }
}


/**
 * 请求参数错误
 */
class ParamError extends BaseError {
    constructor(message = '参数有误', errorCode = '10000', status = 400) {
        super(message, errorCode, status)
    }

}



/**
 * 服务器异常
 */
class ServerError extends BaseError {
        constructor(message = '服务器异常', errorCode = '999', status = 500) {
        super(message, errorCode, status)
    }

}


/**
 * 签名异常
 */
class SignMissError extends BaseError {
        constructor(message = '签名已失效或不存在', errorCode = '20000', status = 400) {
        super(message, errorCode, status)
    }

}

/**
 * token异常
 */
class TokenMissError extends BaseError {
        constructor(message = 'token不存在或已失效', errorCode = '30000', status = 400) {
        super(message, errorCode, status)
    }

}


module.exports = {
    BaseError, ServerError, ParamError, SignMissError, TokenMissError
}