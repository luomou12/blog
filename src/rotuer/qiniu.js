const Router = require('koa-router');
const File = require('../api/file.js');
const QiniuFile = require('../api/qiniu_file.js')
const { ParamError, FileUploadError } = require('../exceptions.js');


// 处理文件上传
const multer = require('multer')
const upload = multer().single('file')
// 文件上传中间件
const upload_midd_ware = async (ctx, next) => {
    const { req, res } = ctx


    const promise = new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) return reject(new FileUploadError())
            resolve()
        }) 
    })

    await promise
    return await next()
}



const qiniu_router = new Router({
    prefix: '/qiniu/'
})



// 创建文件夹
qiniu_router.post('mkdir', (ctx) => {
    const user = ctx.user
    const body = ctx.request.body
    body.tag = (body.tag || '/').trim()
    const dir_name = body.dir_name ? body.dir_name.trim() : ''

    // 参数校验
    if (!dir_name) throw new ParamError('文件夹名称不能为空')
    
    return File.mkdir(user, dir_name, body.tag)
    
})


// 查看文件夹
qiniu_router.get('ls', (ctx) => {
    const user = ctx.user
    const params = ctx.query
    params.tag = (params.tag || '/').trim()

    return File.ls(user, params.tag)
})



// 文件上传
qiniu_router.post('upload', upload_midd_ware, async (ctx) => {
    let tag = (ctx.query.tag || '/').trim( )
    const file = ctx.req.file
    const buffer = file.buffer
    let file_name = file.originalname
    
 
    // 补全路径
    if (tag !== '/' && tag !== ' ') {
        tag = tag.replace(/\\/g, '/').replace(/\/{2,}/g, '/')

        file_name = [tag, file_name].join("/")
        file_name = file_name.replace(/\//, '').replace(/\/{2,}/g, '/')

    }


    // 检测路径是否存在
    const user = ctx.user
    File.ls(user, tag)

    // 上传远程云盘
    const data = await QiniuFile.upload(file_name, buffer)
    
    // 同步更新本地文件配置
    File.upload_user_file(user, tag, file.originalname)
    
    return data
})

module.exports = qiniu_router