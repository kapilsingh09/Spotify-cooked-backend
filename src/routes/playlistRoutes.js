import express from "express";
import { getUserPlaylists } from "../controllers/playlistController.js";

const router = express.Router();

router.get("/user", getUserPlaylists);

export default router;
