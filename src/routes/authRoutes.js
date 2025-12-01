import express from "express";
import { spotifyLogin, spotifyCallback, spotifyLogout } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", spotifyLogin);
router.get("/callback", spotifyCallback);
router.post("/logout", spotifyLogout); // 🔒 SECURE LOGOUT ROUTE

export default router;
