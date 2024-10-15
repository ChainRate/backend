import pkg from "express";
const { Request, Response } = pkg;
import { verifyTransaction, storeReviewOnChain } from "../services/storeReviewService.js";
import { getReviewByAccountAndProgramId } from "../services/getReviewService.js";
import { generateProof } from "../../SolRate_ZKP/scripts/generate_proof.js";
import exp from "constants";
export const submitReview = async (req, res) => {
    try {
        const { sendPubKey, programId, review } = req.body;
        console.log(sendPubKey, programId, review);
        const transactionId = await verifyTransaction(sendPubKey, programId);
        console.log(transactionId);
        if (transactionId[0] !== undefined) {
            await storeReviewOnChain(sendPubKey, programId, review);
            return res.status(200).json({ message: "successfully stored review on chain" });
        } else {
            return res.status(400).json({ message: "Invalid transaction" });
        }
    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getReview = async (req, res) => {
    try {
        const { programId } = req.body;

        if (!programId) {
            return res.status(400).json({ message: "programId is required" });
        }

        console.log("Fetching review for programId:", programId);
        const data = await getReviewByAccountAndProgramId(programId);

        if (!data) {
            return res.status(404).json({ message: `No review found for program id: ${programId}` });
        }

        return res.status(200).json({ message: `Successfully got review for program id: ${programId}`, data: data });
    } catch (error) {
        console.error("Error in getReview:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
