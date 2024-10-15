const fs = require('fs');
const path = require('path');
const snarkjs = require('snarkjs');

/**
 * 验证零知识证明
 * @param {Object} proof - 证明对象
 * @param {Array} publicSignals - 公共信号
 * @returns {boolean} - 验证结果
 */
const verifyProof = async (proof, publicSignals) => {
    try {
        console.log('开始验证证明...');
        const verificationKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../keys/verification_key.json'), 'utf-8'));
        const res = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
        return res;
    } catch (error) {
        console.error('验证证明出错:', error);
        return false;
    }
};

// 如果直接运行此脚本，执行示例
if (require.main === module) {
    const proofPath = path.join(__dirname, '../proofs/proof.json');
    const publicSignalsPath = path.join(__dirname, '../proofs/public_signals.json');

    if (!fs.existsSync(proofPath) || !fs.existsSync(publicSignalsPath)) {
        console.error('证明文件或公共信号文件不存在。请先生成证明。');
        process.exit(1);
    }

    const proof = JSON.parse(fs.readFileSync(proofPath, 'utf-8'));
    const publicSignals = JSON.parse(fs.readFileSync(publicSignalsPath, 'utf-8'));

    verifyProof(proof, publicSignals)
        .then(isValid => {
            if (isValid) {
                console.log('证明有效');
            } else {
                console.log('证明无效');
            }
        })
        .catch(error => {
            console.error('验证证明出错:', error);
        });
}

module.exports = { verifyProof };
