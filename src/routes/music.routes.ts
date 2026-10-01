import { Router } from "express";
import {
    listeningTime,
    nowPlaying,
    summary,
    topArtists,
    topTracks,
} from "../controllers/music.controller.js";

const router = Router();

router.get("/now-playing", nowPlaying);
router.get("/top-artists", topArtists);
router.get("/top-tracks", topTracks);
router.get("/listening-time", listeningTime);
router.get("/summary", summary);

export default router;