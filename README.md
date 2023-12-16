# 半自动证书管理

由于 aliyun oss 上托管的网站难以做到全自动的证书续期，只能尽量简化续期的步骤。

## Create ACME Account
> https://zhuanlan.zhihu.com/p/73981808

`yarn run createAccount`

1. Input your email
2. Save `ACMEAccountKey` & `ACMEAccountUrl` output in console

## Issue/Renew a cert

### Create `.env.<YOUR PROJECT NAME>`

```
OSSAccessKeyId=xxx
OSSAccessKeySecret=xxx
OSSRegion=oss-cn-hongkong
OSSBucket=xxx

ACMEAccountUrl=https://acme-v02.api.letsencrypt.org/acme/acct/xxx
ACMEAccountKey="-----BEGIN PRIVATE KEY-----
xxx
-----END PRIVATE KEY-----"
ACMEDomain=test.example.com
```
Note:

a. make sure your Aliyun RAM user has `OSS` and `Cert` permission.

b. make sure your oss has bound to your `ACMEDomain`


### Run `node scripts/createCert.js <YOUR PROJECT NAME>`

You can shortcut it in package.json

It will create cert and upload to ali cert service, you should bind it to your oss manually.

## Delete expired certs

TBD
