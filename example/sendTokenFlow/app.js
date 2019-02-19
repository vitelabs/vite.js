const sleep = require('sleep-promise')
const vite = require('@vite/vitejs')
const { default: Provider } = require('@vite/vitejs/dist/es5/provider/WS')
const { client: Client, wallet: Wallet } = require('@vite/vitejs')

const { account: Account } = Wallet
let WS_RPC = new Provider('wss://testnet.vitewallet.com/ws')

let client = new Client(WS_RPC)

const DefaultDifficulty = '67108864'
const VTT = 'tti_c55ec37a916b7f447575ae59'
const explorerUrl = 'https://explorer.vite.net/transaction/'
const faucetAddress = 'vite_56fd05b23ff26cd7b0a40957fb77bde60c9fd6ebc35f809c23'

// generate account instance
function genAccount () {
  const key = vite.utils.ed25519.keyPair()
  const account = vite.utils.address.privToAddr.newHexAddr(key.secretKey)
  return new Account({
    privateKey: account.privKey,
    client
  })
}

// get Pow Nonce
async function getPowNonce (addr, prevHash, difficulty = DefaultDifficulty) {
  let realAddr = vite.utils.address.privToAddr.getAddrFromHexAddr(addr)
  let hash = vite.utils.encoder.bytesToHex(
    vite.utils.encoder.blake2b(
      vite.utils.encoder.hexToBytes(realAddr + prevHash),
      null,
      32
    )
  )

  const result = await client.request('pow_getPowNonce', difficulty, hash)
  return {
    nonce: result,
    difficulty
  }
}

// send task loop
// send random amount of VTT token from `account_from` to `account_to` with `count` times
// if out of quota, just run pow
async function sendLoop (from, to, count) {
  while (count--) {
    try {
      await from.sendTx({
        toAddress: to.address,
        tokenId: VTT,
        amount: (Math.random() * 1e19).toString(),
        message: ''
      })
    } catch (e) {
      try {
        console.log(explorerUrl + await calcPowAndSend(from, e))
      } catch (e) {
      }
    }
    await sleep(2000)
  }
}

// send VTT back to the faucet
async function sendBackToFaucet (from, to) {
  let { balance } = await from.getBalance()
  let totalAmount = balance && balance.tokenBalanceInfoMap[VTT] && balance.tokenBalanceInfoMap[VTT]['totalAmount']
  if (totalAmount) {
    try {
      await from.sendTx({
        toAddress: faucetAddress,
        tokenId: VTT,
        amount: totalAmount,
        message: ''
      })
    } catch (e) {
      try {
        console.log(explorerUrl + await calcPowAndSend(from, e))
      } catch (e) {
      }
    }
  }
  await sleep(2000);

  ({ balance } = await to.getBalance())
  totalAmount = balance && balance.tokenBalanceInfoMap[VTT] && balance.tokenBalanceInfoMap[VTT]['totalAmount']
  if (totalAmount) {
    try {
      await to.sendTx({
        toAddress: faucetAddress,
        tokenId: VTT,
        amount: totalAmount,
        message: ''
      })
    } catch (e) {
      try {
        console.log(explorerUrl + await calcPowAndSend(to, e))
      } catch (e) {
      }
    }
  }
}

// receive loop
// receive all tokens
async function receiveLoop (account) {
  try {
    const onroadBlocks = await client.onroad.getOnroadBlocksByAddress(account.address, 0, 100)

    for (const onroadBlock of onroadBlocks) {
      try {
        await account.receiveTx({
          fromBlockHash: onroadBlock.hash
        })
      } catch (e) {
        console.log(explorerUrl + await calcPowAndSend(account, e))
      }
      await sleep(2000)
    }
  } catch (e) {}
}

// get some TestToken VTT and receive them
async function getTestToken (account) {
  try {
    await client.request('testapi_getTestToken', account.address)
    const onroadBlocks = await client.onroad.getOnroadBlocksByAddress(account.address, 0, 100)

    for (const onroadBlock of onroadBlocks) {
      try {
        await account.receiveTx({
          fromBlockHash: onroadBlock.hash
        })
      } catch (e) {
        console.log(explorerUrl + await calcPowAndSend(account, e))
      }
      await sleep(2000)
    }
  } catch (e) {}
}

// if error msg is out of quota then just run pow
async function calcPowAndSend (account, e) {
  if (!e || !e.accountBlock || !e.error || e.error.message !== 'out of quota') {
    throw e
  }
  let accountBlock = e.accountBlock
  accountBlock = await vite.utils.accountBlock.getAccountBlock(accountBlock)
  accountBlock.height = String(Number(accountBlock.height) - 1)

  const data = await getPowNonce(accountBlock.accountAddress, accountBlock.prevHash)
  accountBlock.difficulty = data.difficulty
  accountBlock.nonce = data.nonce

  await account.sendRawTx(accountBlock)
  return vite.utils.accountBlock.getBlockHash(accountBlock)
}

// generate task
async function genTask () {
  try {
    const from = genAccount()
    console.log('generate account from:', from.address)
    const to = genAccount()
    console.log('generate account to:', to.address)
    console.log('get some VTT to', from.address)
    await getTestToken(from)
    console.log('send some VTT to', to.address)
    await sendLoop(from, to, 1)
    console.log('get the onroad VTT to', to.address)
    await receiveLoop(to)
    console.log('send VTT back to faucet')
    await sendBackToFaucet(from, to)
  } catch (e) {}
}

(async () => {
  const tasks = []
  let count = 1
  while (count--) {
    tasks.push(genTask())
  }
  try {
    await Promise.all(tasks)
  } catch (e) {
    console.log(e)
  }
  console.log('all tasks completed')
  process.exit()
})()
