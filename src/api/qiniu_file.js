const qiniu = require("qiniu")
const { FileUploadError } = require('../exceptions.js')
const { accessKey, secretKey, bucket, domain } = require("../config.json").qiniu


class QiniuFile{
    // 七牛云配置
    accessKey = accessKey 
    secretKey = secretKey
    bucket = bucket
    domain = domain
    
    // 单例模式
    static instance = new QiniuFile()

    // 创建鉴权对象
    get mac(){
        return new qiniu.auth.digest.Mac(this.accessKey, this.secretKey); 
    }

    // 上传凭证
    get upload_token(){
        const options = { scope: bucket, expires: 7200 }; // 上传策略参数
        const putPolicy = new qiniu.rs.PutPolicy(options); // 创建上传策略对象
         
        return putPolicy.uploadToken(this.mac); // 生成上传凭证
    }

    // 配置对象
    get config(){
        const config = new qiniu.conf.Config(); // 创建配置对象
        config.regionsProvider = qiniu.httpc.Region.fromRegionId("z2"); // 指定上传区域
        // config.useHttpsDomain = true; // 使用https上传域名
        // config.useCdnDomain = true; // 使用CDN上传域名
    }

    // 上传对象
    get formUploder(){
        return new qiniu.form_up.FormUploader(this.config); // 创建上传对象
    }




    /**
     * @param {string} key 上传到七牛后保存的文件名
     * @param {Buffer} buffer 文件的Buffer数据
     * @returns {Promise} 返回一个Promise对象，上传成功时返回文件信息，上传失败时抛出错误
     */
    static upload(key, buffer){
        const instance = this.instance
        const uploadToken = instance.upload_token // 上传凭证
        const putExtra = new qiniu.form_up.PutExtra(); // 创建上传额外参数对象
        const formUploader = instance.formUploder


        const { Readable } = require('stream')
        
        // // 可读流上传
        return formUploader
        .putStream(uploadToken, key, Readable.from(buffer), putExtra)
        .then(({ data, resp }) => {
            if (resp.statusCode === 200) return data
            return new FileUploadError(data, resp.statusCode)
        })
        .catch((err) => err)
        
        // buffer上传
        // return formUploader
        // .put(uploadToken, key, buffer, putExtra)
        // .then(({ data, resp }) => {
        //     if (resp.statusCode === 200) return data
        //     return new FileUploadError(data, resp.statusCode)
        // })
        // .catch((err) => err) 

    } 
}



module.exports = QiniuFile