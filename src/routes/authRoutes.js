import express from "express";
import { spotifyLogin, spotifyCallback } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", spotifyLogin);
router.get("/callback", spotifyCallback);

export default router;
