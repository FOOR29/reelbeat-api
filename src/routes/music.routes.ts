import { Router } from "express";
import { nowPlaying } from "../controllers/music.controller.js";

const router = Router();

router.get("/now-playing", nowPlaying);

export default router;