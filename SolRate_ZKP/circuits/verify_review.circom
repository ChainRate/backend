pragma circom 2.1.6;

template VerifyReview() {
    // 私有输入（哈希后的地址）
    signal input transactionId;
    signal input initiatorAddressHash;
    signal input projectAddressHash;

    // 公共输入（链上哈希后的地址）
    signal input onchainTransactionId;
    signal input onchainInitiatorAddressHash;
    signal input onchainProjectAddressHash;

    // 输出信号：是否验证通过
    signal output isVerified;

    // 用于判断每个字段是否相等的布尔信号
    signal matchTransactionIdBool;
    signal matchInitiatorAddressBool;
    signal matchProjectAddressBool;

    // 使用二次约束判断是否相等
    // 如果 transactionId == onchainTransactionId, 则 matchTransactionIdBool 必须为 1
    matchTransactionIdBool <== 1 - (transactionId - onchainTransactionId)*(transactionId - onchainTransactionId);
    matchInitiatorAddressBool <== 1 - (initiatorAddressHash - onchainInitiatorAddressHash)*(initiatorAddressHash - onchainInitiatorAddressHash);
    matchProjectAddressBool <== 1 - (projectAddressHash - onchainProjectAddressHash)*(projectAddressHash - onchainProjectAddressHash);

    // 逐步应用逻辑与操作，确保每次只涉及二次约束
    signal intermediateBool;
    intermediateBool <== matchTransactionIdBool * matchInitiatorAddressBool;
    isVerified <== intermediateBool * matchProjectAddressBool;
    isVerified === 1;
}

component main {public [onchainTransactionId, onchainInitiatorAddressHash, onchainProjectAddressHash]} = VerifyReview();
