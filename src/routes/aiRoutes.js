import express from "express";
import { roastUserPlaylists } from "../controllers/aiController.js";

const router = express.Router();

router.post("/roast-playlists", roastUserPlaylists);

export default router;
