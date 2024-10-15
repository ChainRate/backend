const url = "https://api.devnet.staging.aptoslabs.com/v1/graphql";

const payload = {
  operationName: "AccountTransactionsData",
  variables: {
    address: "0x4bc36163958f8b83bf067ab1123bda596f6d7fd09354851ffba51cfabf20efe9",
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

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => console.log(data.data))
  .catch(error => console.error(error));
