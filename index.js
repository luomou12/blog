const Koa = require('koa');
const { koaBody } = require('koa-body');
const router = require('./src/rotuer/index.js')
const app = new Koa();




/* 中间件 */
app.use(require('./src/middlewares/error.js')) // 处理错误
app.use(koaBody()) // 处理请求体 
app.use(require('./src/middlewares/result.js')) // 处理返回结果


/* 用户路由 */
router(app)



app.listen(3000, () => {
    console.log('Server running on http://127.0.0.1:3000');
});

