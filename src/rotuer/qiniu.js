const Router = require('koa-router');


const qiniu_router = new Router({
    prefix: '/qiniu/'
})


qiniu_router.post('upload', (ctx) => {
    console.log(888);
    
    return '999'
})

module.exports = qiniu_router