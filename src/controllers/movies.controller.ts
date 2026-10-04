import type { Request, Response } from "express";
import { getRecentMovies } from "../services/trakt.service.js";
import { parseLimit } from "../utils/query.js";

export async function recentMovies(req: Request, res: Response) {
    const limit = parseLimit(req.query.limit, 50, 100);
    res.json(await getRecentMovies(limit))
}

