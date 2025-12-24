import express from "express";
import { roastUserPlaylists } from "../controllers/aiController.js";

const router = express.Router();

router.post("/roast-playlists", roastUserPlaylists);

router.get("/roast-check", (req, res) => {
  res.status(200).send("AI Routes are working!");
});
export default router;
