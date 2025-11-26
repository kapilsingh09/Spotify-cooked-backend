import express from "express";
import { loginWithSpotify, spotifyCallback } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", loginWithSpotify);
router.get("/callback", spotifyCallback);

export default router;
