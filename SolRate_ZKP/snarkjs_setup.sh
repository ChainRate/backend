#!/bin/bash

set -e  # 如果任何命令失败，脚本会退出

echo "创建必要的目录..."
mkdir -p build keys proofs inputs

echo "编译电路..."
circom circuits/verify_review.circom --r1cs --wasm --sym -o build

echo "初始化 Powers of Tau..."
npx snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
npx snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v -e="random text"

echo "准备 Powers of Tau 阶段 2..."
npx snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

echo "设置 Groth16..."
npx snarkjs groth16 setup build/verify_review.r1cs pot12_final.ptau keys/verify_review.zkey

echo "贡献密钥到 Groth16..."
npx snarkjs zkey contribute keys/verify_review.zkey keys/verify_review_final.zkey --name="Contributor Name" -v -e="another random text"

echo "导出验证密钥..."
npx snarkjs zkey export verificationkey keys/verify_review_final.zkey keys/verification_key.json

echo "SnarkJS 设置完成。"
