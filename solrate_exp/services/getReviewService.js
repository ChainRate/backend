import axios from 'axios';
const rootAddress = '0x4bc36163958f8b83bf067ab1123bda596f6d7fd09354851ffba51cfabf20efe9'; //project address
async function getAccountTransactions() {
    const url = "https://api.devnet.staging.aptoslabs.com/v1/graphql";
  
    const payload = {
      operationName: "AccountTransactionsData",
      variables: {
        address: rootAddress,
        limit: 25,
        offset: 0
      },
      query: `query AccountTransactionsData($address: String, $limit: Int, $offset: Int) {
        account_transactions(
          where: {account_address: {_eq: $address}}
          order_by: {transaction_version: desc}
          limit: $limit
          offset: $offset
        ) {
          transaction_version
          __typename
        }
      }`
    };
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  
    const data = await response.json();
    let arr = [];
    const res = data.data.account_transactions;
    return res;
  }
  async function getReviewData(transactionVersions,programId) {
    const baseUrl = 'https://api.devnet.staging.aptoslabs.com/v1/transactions/by_version/';
    const reviewDataList = [];
  
    for (const tx of transactionVersions) {
      const transactionVersion = tx.transaction_version;
      const url = `${baseUrl}${transactionVersion}`;
  
      try {
        const response = await axios.get(url);
        const data = response.data;
  
        // 从 changes 中提取 reviewer_account 和 review_url
        const changes = data.changes || [];
        for (const change of changes) {
          if (change.type === 'write_resource') {
            const resourceData = change.data || {};
            if (resourceData.data.contract_address === `${programId}`) {
              const innerData = resourceData.data || {};
              const reviewerAccount = innerData.reviewer_account;
              const reviewUrl = innerData.review_url;
              reviewDataList.push({
                reviewer_account: reviewerAccount,
                review_url: reviewUrl
              });
            }
          }
        }
      } catch (error) {
        console.error(`无法获取 transaction_version ${transactionVersion} 的数据：`, error.message);
      }
    }
  
    return reviewDataList;
  }
export async function getReviewByAccountAndProgramId(programId){
    try{
        const resVersion = await getAccountTransactions(programId);
        const reviewList = await getReviewData(resVersion,programId);
        //console.log(reviewList);
        return reviewList;
    }
    catch(error){
        console.log(error);
        return [];
    }

}