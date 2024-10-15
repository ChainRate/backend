## 0. Overview

This project implements Zero-Knowledge Proofs (ZKP) using [Circom](https://github.com/iden3/circom) and [SnarkJS](https://github.com/iden3/snarkjs) for a Solana-based Review Platform. The ZKP mechanism ensures that certain actions, such as submitting a review, can be verified without revealing sensitive information. This enhances privacy and trust within the platform.

------

## 1. Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 14.x or later)
- **npm** (comes with Node.js)
- **Git Bash** (for Windows users) or any Unix-like terminal
- **Circom 2.0.0** (for compiling circuits)
- **SnarkJS** (for generating and verifying proofs)

## 2. Environment Configuration

### 2.1. Install Circom 2.0.0

Circom 2.0.0 is not available via npm and needs to be installed manually.

#### **2.1.1. For Windows Users:**

1. **Download Circom 2.0.0:**

   - Visit the [Circom Releases Page](https://github.com/iden3/circom/releases/tag/v2.0.0).
   - Download `circom-2.0.0-win64.zip`.

2. **Extract and Install:**

   - Extract the ZIP file to a directory, e.g., `C:\circom`.
   - Add `C:\circom` to your system `PATH`
     - Press `Win + R`, type `sysdm.cpl`, and press Enter.
     - In the "System Properties" window, go to the "Advanced" tab and click on "Environment Variables".
     - Under "System variables", find and select `Path`, then click "Edit".
     - Click "New" and add `C:\circom`.
     - Click "OK" to save changes.

3. **Verify Installation:**

   Open a new Git Bash terminal and run:

   ```bash
   circom --version
   ```

   **Expected Output:**

   ```bash
   circom 2.0.0
   ```

#### **2.1.2. For Unix/Linux/macOS Users:**

1. **Download Circom 2.0.0:**

   - Visit the [Circom Releases Page](https://github.com/iden3/circom/releases/tag/v2.0.0).
   - Download the appropriate binary for your OS, e.g., `circom-2.0.0-linux64.tar.gz`.

2. **Extract and Install:**

   ```bash
   tar -xzf circom-2.0.0-linux64.tar.gz
   sudo mv circom /usr/local/bin/
   ```

3. **Verify Installation:**

   ```bash
   circom --version
   ```

   **Expected Output:**

   ```bash
   circom 2.0.0
   ```

### 2.2. Ensure SnarkJS is Installed Locally

SnarkJS is installed as a local dependency via `npm install`. It will be invoked via `npx` to ensure the correct version is used.

```bash
npx snarkjs --version
```

**Expected Output:**

```bash
SnarkJS v0.6.11
```

## 3. Project Structure

```lua
zkp/
├── circuits/
│   └── verify_review.circom
├── scripts/
│   ├── generate_proof.js
│   └── verify_proof.js
├── inputs/
│   └── input.json
├── keys/
│   ├── verify_review.zkey
│   ├── verify_review_final.zkey
│   └── verification_key.json
├── build/
│   ├── verify_review.r1cs
│   ├── verify_review.sym
│   └── verify_review_js/
│       └── verify_review.wasm
├── proofs/
│   ├── proof.json
│   └── public_signals.json
├── package.json
├── snarkjs_setup.sh
└── README.md
```

## 4. Setting Up the ZKP Environment

### 4.1. Compile the Circuit

Ensure that the circuit file `circuits/verify_review.circom` is correctly defined.

### 4.2. Run the Setup Script

The `snarkjs_setup.sh` script compiles the circuit, generates the trusted setup (`zkey` files), and exports the verification key.

**Ensure the script is executable:**

```bash
chmod +x snarkjs_setup.sh
```

**Run the setup script:**

```bash
./snarkjs_setup.sh
```

**Expected Output:**

```bash
Creating necessary directories...
Compiling the circuit...
... [Circom Compilation Output]
Initializing Powers of Tau...
... [SnarkJS Powers of Tau Output]
Setting up Groth16...
... [SnarkJS Groth16 Output]
Contributing to Groth16...
... [SnarkJS ZKey Contribution Output]
Exporting verification key...
SnarkJS setup completed successfully.
```

### 4.3. Verify Setup

After running the setup script, check the `keys/` directory for the following files:

- `verify_review.zkey`
- `verify_review_final.zkey`
- `verification_key.json`

Ensure the `verify_review_final.zkey` file is present and has a reasonable file size (e.g., several MBs).

```
ls keys/
```

**Expected Output:**

```
verify_review.zkey
verify_review_final.zkey
verification_key.json
```

## 5. Generating Proofs

### 5.1. Using the SnarkJS CLI

You can generate proofs using the SnarkJS command-line interface.

**Command:**

```
npx snarkjs groth16 fullprove ./inputs/input.json ./build/verify_review_js/verify_review.wasm ./keys/verify_review_final.zkey ./proofs/proof.json ./proofs/public_signals.json
```

**Explanation:**

- `./inputs/input.json`: The input data for the circuit.
- `./build/verify_review_js/verify_review.wasm`: The compiled circuit.
- `./keys/verify_review_final.zkey`: The final `.zkey` file from the trusted setup.
- `./proofs/proof.json`: The output proof file.
- `./proofs/public_signals.json`: The public signals output.

**Expected Output:**

```
SnarkJS v0.6.11
... [Proof generation details]
Proof generated and saved to proofs/proof.json
Public signals saved to proofs/public_signals.json
```

### 5.2. Using the `generate_proof.js` Script

Alternatively, you can use the provided Node.js script to generate proofs.

**Expected Output:**

```
yaml复制代码Starting proof generation...
Transaction ID: 123456
Initiator Address (Hex): 5f1c3a...
Project Address (Hex): 1a2b4c...
Preparing input data: { ... }
Input file written: /path/to/zkp/inputs/input.json
Calling SnarkJS to generate proof...
Proof and public signals generated
Proof saved: /path/to/zkp/proofs/proof.json
Public signals saved: /path/to/zkp/proofs/public_signals.json
Proof generated successfully: { pi_a: [...], pi_b: [...], pi_c: [...] }
```

**Recommend for Integration** 

## 6. Verifying Proofs

### 6.1. Using the SnarkJS CLI

After generating a proof, you can verify it using SnarkJS.

**Command:**

```
npx snarkjs groth16 verify ./keys/verification_key.json ./proofs/public_signals.json ./proofs/proof.json
```

**Expected Output:**

```
SnarkJS v0.6.11
... [Verification details]
OK!
```

Or

```
Invalid proof
```

### 6.2. Using the `verify_proof.js` Script

**Script: `scripts/verify_proof.js`**

**Usage:**

```
node scripts/verify_proof.js
```

**Expected Output:**

```
Starting proof verification...
Proof is valid.
```

Or

```
Starting proof verification...
Proof is invalid.
```

**Recommend for Integration** 

## 7. Integration with Frontend and Backend

### 7.1. Backend Integration

1. **Generating Proofs on Review Submission**

   When a user submits a review, the backend should:

   - Collect necessary data: `transactionId`, `initiatorAddress`, `projectAddress`, `onchainTransactionId`, `onchainInitiatorAddress`, `onchainProjectAddress`
   - Call the `generate_proof.js` script (or its functions) to generate a proof.
   - Store the proof (`proof.json` and `public_signals.json`) alongside the review in the database.

2. **Verifying Proofs**

   To verify proofs, the backend can:

   - Retrieve the stored proof and public signals.
   - Call the `verify_proof.js` script (or its functions) to verify the proof.
   - Confirm that the proof is valid before accepting the review.

### 7.2. Frontend Integration

1. **Submitting Reviews**
   - Users interact with the frontend to submit reviews.
   - The frontend sends review data to the backend, which includes generating a ZKP.
2. **Displaying Reviews**
   - Reviews can include the ZKP data to allow for verification.
   - Frontend can call the backend to verify proofs when displaying reviews, ensuring authenticity without exposing sensitive data.

**Note:** Ensure secure communication between frontend and backend when handling proofs and sensitive data.

## 8. Troubleshooting

### 8.1. Common Issues and Solutions

1. **`snarkjs` command not found**

   **Solution:**

   - Ensure SnarkJS is installed locally (`npm install snarkjs`).
   - Use `npx snarkjs` instead of `snarkjs` directly.
   - Verify that `node_modules/.bin` is in your `PATH`.

2. **Missing `.zkey` Files**

   **Solution:**

   - Run the `snarkjs_setup.sh` script to generate the `.zkey` files.
   - Ensure the setup script completes without errors.
   - Verify file paths and permissions.

3. **Invalid File Format Error for `.zkey`**

   **Solution:**

   - Ensure the `.zkey` file was correctly generated by SnarkJS.

   - Re-run the setup script to regenerate `.zkey` files if necessary.

   - Check that the correct `.zkey` file is being referenced.

4. **Proof Generation Fails**

   **Solution:**

   - Ensure `input.json` has correct data and matches the circuit's input format.

   - Check that all required files (`.wasm`, `.zkey`) are present and correctly referenced.

   - Review the `generate_proof.js` logs for detailed error messages.

5. **Invalid Proof**

   **Solution:**

   * Ensure the input data matches the public signals.

   * Verify that the circuit logic is correct and consistent with the input data.

   * Re-generate proofs if necessary.

## 8.2. Additional Resources

- [Circom GitHub Repository](https://github.com/iden3/circom)

- [SnarkJS Documentation](https://github.com/iden3/snarkjs)

- [Zero-Knowledge Proofs Overview](https://en.wikipedia.org/wiki/Zero-knowledge_proof)

  

------

**Feel free to reach out if you have any questions or need further assistance!**