module.exports = async (ctx, next) => {

    const result = await next();
    ctx.body = {
        data: result,
        code: 200,
        msg: 'success'
    }
    
}