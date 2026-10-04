import { Router } from "express";
import { recentMovies } from "../controllers/movies.controller.js";

const router = Router();

router.get("/recent", recentMovies)

export default router;