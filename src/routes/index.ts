import { Router } from "express";
import musicRoutes from "./music.routes.js";
import movieRouter from "./movies.routes.js"

const router = Router();

router.use("/music", musicRoutes);
router.use("/movies", movieRouter)

export default router;