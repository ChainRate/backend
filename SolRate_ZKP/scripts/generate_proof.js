const fs = require('fs');
const path = require('path');
const snarkjs = require('snarkjs');

/**
 * 生成零知识证明
 * @param {string} transactionId - 交易ID
 * @param {string} initiatorAddress - 交易发起方公钥地址
 * @param {string} projectAddress - 要评价的项目方地址
 * @returns {Object|null} - 证明对象或null
 */
const generateProof = async (transactionId, initiatorAddress, projectAddress, onchainTransactionId, onchainInitiatorAddress, onchainProjectAddress) => {
    try {
        // 将地址转换为数值表示（假设为16进制字符串）
        const transactionIdInt = parseInt(transactionId, 10);
        const initiatorAddressHash = BigInt(`0x${initiatorAddress}`).toString();
        const projectAddressHash = BigInt(`0x${projectAddress}`).toString();
        const onchainTransactionIdInt = parseInt(onchainTransactionId, 10);
        const onchainInitiatorAddressHash = BigInt(`0x${onchainInitiatorAddress}`).toString();
        const onchainProjectAddressHash = BigInt(`0x${onchainProjectAddress}`).toString();

        // 准备输入
        const input = {
            transactionId: transactionIdInt,
            initiatorAddressHash: initiatorAddressHash,
            projectAddressHash: projectAddressHash,
            onchainTransactionId: onchainTransactionIdInt,
            onchainInitiatorAddressHash: onchainInitiatorAddressHash,
            onchainProjectAddressHash: onchainProjectAddressHash,
        };

        // 写入输入文件
        const inputPath = path.join(__dirname, '../inputs/input.json');
        fs.writeFileSync(inputPath, JSON.stringify(input), 'utf-8');

        // 生成证明和公共信号
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            path.join(__dirname, '../build/verify_review_js/verify_review.wasm'),
            path.join(__dirname, '../keys/verify_review_final.zkey')
        );

        // 保存证明
        const proofPath = path.join(__dirname, '../proofs/proof.json');
        fs.writeFileSync(proofPath, JSON.stringify(proof), 'utf-8');

        // 保存公共信号（可选）
        const publicSignalsPath = path.join(__dirname, '../proofs/public_signals.json');
        fs.writeFileSync(publicSignalsPath, JSON.stringify(publicSignals), 'utf-8');

        console.log('证明生成成功');
        return proof;
    } catch (error) {
        console.error('生成证明出错:', error);
        return null;
    }
};

// 如果直接运行此脚本，执行示例
if (require.main === module) {
    const transactionId = '123456';
    const initiatorAddress = '1234567890123456789012345678901234567890123456789012345678901234567890'; // 示例地址，需为有效的16进制字符串
    const projectAddress = '1234567890123456789012345678901234567890123456789012345678901234567890';   // 示例地址，需为有效的16进制字符串
    const onchainTransactionId = '123456';
    const onchainInitiatorAddress = "13814534342831658746328627318608961520102344302430889474911627436946699159830308264";
    const onchainProjectAddress = "138145343428316587463286273186089615201023443024308894749116274369466991598303082640";

    generateProof(transactionId, initiatorAddress, projectAddress, onchainTransactionId, onchainInitiatorAddress, onchainProjectAddress)
        .then(proof => {
            if (proof) {
                console.log('证明:', proof);  // 输出在proofs/proof.json
            } else {
                console.log('证明生成失败');  // 不匹配
            }
        })
        .catch(error => {
            console.error('生成证明出错:', error);  // 报错
        });
}

module.exports = { generateProof };
