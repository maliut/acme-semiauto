const $OpenApi = require('@alicloud/openapi-client')
const $cas20200407 = require('@alicloud/cas20200407')
const cas20200407 = $cas20200407.default
const $Util = require('@alicloud/tea-util')

function createClient(accessKeyId, accessKeySecret) {
  const config = new $OpenApi.Config({
    // 必填，您的 AccessKey ID
    accessKeyId: accessKeyId,
    // 必填，您的 AccessKey Secret
    accessKeySecret: accessKeySecret,
  })
  // Endpoint 请参考 https://api.aliyun.com/product/cas
  config.endpoint = 'cas.aliyuncs.com'
  return new cas20200407(config)
}

function getCurrentDate() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return yyyy + mm + dd
}

async function uploadCert({ envName, accessKeyId, accessKeySecret, cert, key }) {
  const client = createClient(accessKeyId, accessKeySecret)
  const uploadUserCertificateRequest = new $cas20200407.UploadUserCertificateRequest({
    name: `${envName}-${getCurrentDate()}`,
    key,
    cert
  })
  const runtime = new $Util.RuntimeOptions({})
  try {
    // 复制代码运行请自行打印 API 的返回值
    await client.uploadUserCertificateWithOptions(uploadUserCertificateRequest, runtime)
    console.log('Upload cert success!')
  } catch (error) {
    // 错误 message
    console.log(error.message);
    // 诊断地址
    console.log(error.data["Recommend"]);
  }
}

module.exports = { uploadCert }
