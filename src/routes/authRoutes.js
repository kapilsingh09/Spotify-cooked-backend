import express from "express";
import { spotifyLogin, spotifyCallback, spotifyLogout } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", spotifyLogin);
router.get("/callback", spotifyCallback);
router.get("/logout", spotifyLogout); // 🔒 SECURE LOGOUT ROUTE (changed to GET for redirect)

export default router;
