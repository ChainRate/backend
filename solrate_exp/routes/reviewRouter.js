import { Router } from "express";
import { getReview, submitReview } from "../controllers/reviewController.js";

const router = Router();

router.post("/submit", submitReview);

router.post("/get", getReview);

export default router;
