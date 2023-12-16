const readline = require('readline')
const acme = require('acme-client')

async function getUserEmail() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => {
    rl.question('Please enter your email:\n', email => {
      rl.close()
      resolve(email.trim())
    })
  })
}

async function main() {

  const email = await getUserEmail()
  if (!email) {
    console.error('Please enter your email')
    return
  }

  const privateKey = await acme.crypto.createPrivateKey()

  console.log('ACMEAccountKey:')
  console.log(privateKey.toString())

  const client = new acme.Client({
    directoryUrl: acme.directory.letsencrypt.production,
    accountKey: privateKey
  })

  const account = await client.createAccount({
    termsOfServiceAgreed: true,
    contact: [`mailto:${email}`]
  })

  console.log('ACMEAccountUrl:')
  console.log(client.getAccountUrl())
}

main()
