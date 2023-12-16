const envName = process.argv[2]
if (!envName) {
  console.error('Please enter project name')
}

const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, `../.env.${envName}`) })

const acme = require('acme-client')
const client = new acme.Client({
  directoryUrl: acme.directory.letsencrypt.production,
  accountKey: process.env.ACMEAccountKey,
  accountUrl: process.env.ACMEAccountUrl
})

const OSS = require('ali-oss')
const ossClient = new OSS({
  region: process.env.OSSRegion,
  accessKeyId: process.env.OSSAccessKeyId,
  accessKeySecret: process.env.OSSAccessKeySecret,
  bucket: process.env.OSSBucket
})

const { uploadCert } = require('./uploadCert')

/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */

async function challengeCreateFn(authz, challenge, keyAuthorization) {
  console.log('Triggered challengeCreateFn()');

  /* http-01 */
  if (challenge.type === 'http-01') {
    const filePath = `.well-known/acme-challenge/${challenge.token}`;
    const fileContents = keyAuthorization;

    console.log(`Creating challenge response for ${authz.identifier.value} at path: ${filePath}`);

    /* Replace this */
    console.log(`Would write "${fileContents}" to path "${filePath}"`);

    // upload to oss
    await ossClient.put(filePath, Buffer.from(fileContents))
    console.log('Success!')
  }

  /* dns-01 */
  else if (challenge.type === 'dns-01') {
    // const dnsRecord = `_acme-challenge.${authz.identifier.value}`;
    // const recordValue = keyAuthorization;
    //
    // log(`Creating TXT record for ${authz.identifier.value}: ${dnsRecord}`);
    //
    // /* Replace this */
    // log(`Would create TXT record "${dnsRecord}" with value "${recordValue}"`);
    // await dnsProvider.createRecord(dnsRecord, 'TXT', recordValue);
    throw new Error('not implemented yet')
  }
}


/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */

async function challengeRemoveFn(authz, challenge, keyAuthorization) {
  console.log('Triggered challengeRemoveFn()');

  /* http-01 */
  if (challenge.type === 'http-01') {
    const filePath = `.well-known/acme-challenge/${challenge.token}`;

    console.log(`Removing challenge response for ${authz.identifier.value} at path: ${filePath}`);

    /* Replace this */
    console.log(`Would remove file on path "${filePath}"`);

    // Delete from oss
    await ossClient.delete(filePath)
    console.log('Success!')
  }

  /* dns-01 */
  else if (challenge.type === 'dns-01') {
    // const dnsRecord = `_acme-challenge.${authz.identifier.value}`;
    // const recordValue = keyAuthorization;
    //
    // log(`Removing TXT record for ${authz.identifier.value}: ${dnsRecord}`);
    //
    // /* Replace this */
    // log(`Would remove TXT record "${dnsRecord}" with value "${recordValue}"`);
    // await dnsProvider.removeRecord(dnsRecord, 'TXT');
    throw new Error('not implemented yet')
  }
}


async function main() {
  /* Create CSR */
  const [key, csr] = await acme.crypto.createCsr({
    commonName: process.env.ACMEDomain
  })

  /* Certificate */
  const cert = await client.auto({
    csr,
    termsOfServiceAgreed: true,
    challengeCreateFn,
    challengeRemoveFn
  })

  /* Done */
  const keyStr = key.toString()
  const certStr = cert.toString()
  console.log(`CSR:\n${csr.toString()}`)
  console.log(`Private key:\n${keyStr}`)
  console.log(`Certificate:\n${certStr}`)

  // upload
  await uploadCert({
    envName,
    accessKeyId: process.env.OSSAccessKeyId,
    accessKeySecret: process.env.OSSAccessKeySecret,
    cert: certStr,
    key: keyStr
  })
}

main()
