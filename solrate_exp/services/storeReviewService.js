import { AptosClient, AptosAccount, BCS, TxnBuilderTypes } from 'aptos'; // 根据你使用的链引入正确的SDK
import { generateProof } from '../../SolRate_ZKP/scripts/generate_proof.js';
import axios from 'axios';

/* const rpcurl = 'https://solana-devnet.g.alchemy.com/v2/sRf9k2W6LSkb1vfYgOSrJKAb_zAeetdp';

// 连接到 Solana 网络
const connection = new Connection(rpcurl, { 
    commitment: 'confirmed', 
}); */
const NODE_URL = 'https://fullnode.devnet.aptoslabs.com/v1';
const client = new AptosClient(NODE_URL);

// 测试用密钥对
const onchainProjectAddress = '0x4bc36163958f8b83bf067ab1123bda596f6d7fd09354851ffba51cfabf20efe9'; //project address
const onchainInitiatorAddress = '0x9426d62ee2e4d2ce229bb73499e78eb52fb0c39072987d8fc59187d7321d2717'; //project deployer address
//const secretKey = "0xa421b7ec89bdb6617b417cb5150e53a83761f50a0144f804827c0f7b27b06832"; //onchainInitiator's private key
const privateKeyHex = "a421b7ec89bdb6617b417cb5150e53a83761f50a0144f804827c0f7b27b06832";
const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
const localAccount = new AptosAccount(privateKeyBytes);

/**
 * Verify a transaction by searching for a specific sender public key
 * in transactions involving a given program ID.
 *
 * @param {string} senderPubKey - The sender's public key.
 * @param {string} calledProgramId - The program ID to search for transactions.
 * @returns {Promise<string[]>} - List of matching transaction IDs.
 */
export async function verifyTransaction(senderPubKey, calledProgramId) {
  try {
    const url = `https://fullnode.devnet.aptoslabs.com/v1/accounts/${senderPubKey}/transactions`;

    // 获取该地址的所有交易数据
    const response = await axios.get(url);

    if (!response.data || response.data.length === 0) {
      console.log('No transactions found for the given program ID.');
      return [];
    }

    // 查找包含指定 calledProgramId 的交易，并匹配发送者公钥
    const matchingTransactions = response.data.filter((tx) =>
      tx.changes.some((change) =>
        change.data?.abi?.address === calledProgramId
      ) && tx.sender === senderPubKey
    );

    // 提取符合条件的交易的 ID
    const transactionIds = matchingTransactions.map((tx) => tx.hash);
    //console.log(transactionIds);
    return transactionIds;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return [];
  }
}
function isValidAptosAddress(address) {
  const hexRegex = /^0x[0-9a-fA-F]{1,64}$/;
  const noPrefixHexRegex = /^[0-9a-fA-F]{1,64}$/;
  return hexRegex.test(address) || noPrefixHexRegex.test(address);
}

function ensureHexPrefix(address) {
  return address.startsWith('0x') ? address : '0x' + address;
}
// 存储评价到链上
export async function storeReviewOnChain(senderPubKey, projectAddress, review) {
    const zk_proof_raw = await generateProof("10000", senderPubKey, projectAddress, "10000", onchainInitiatorAddress, onchainProjectAddress);
    const zk_proof = JSON.stringify(zk_proof_raw);
    // 替换为您的模块地址
    const moduleAddress = '0x4bc36163958f8b83bf067ab1123bda596f6d7fd09354851ffba51cfabf20efe9'; // 请替换为您的模块地址
    const functionName = `${moduleAddress}::review_store::store_review`;
    const textEncoder = new TextEncoder();
    
    // 定义交易负载
    const payload = {
        type: 'entry_function_payload',
        function: functionName,
        type_arguments: [],
        arguments: [
            senderPubKey,
            projectAddress,
            review,  
            zk_proof
        ]
    };
    try{
      console.log(localAccount.address());
      const txnRequest = await client.generateTransaction(localAccount.address(), payload);
      // sign transaction
      const signedTransaction = AptosClient.generateBCSTransaction(
        localAccount,
        txnRequest,
      );
  
      // 等待交易确认
      // submit transaction
      const txn = await client.submitSignedBCSTransaction(signedTransaction);
      console.log('交易状态：', txn);
  
      console.log('交易已提交！交易哈希：' + txn.hash);
    }
    catch(error){
      console.error('Error generating transaction:', error);
    }

}