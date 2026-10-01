import type { Request, Response } from "express";
import {
    getListeningTime,
    getNowPlaying,
    getSummary,
    getTopArtists,
    getTopTracks,
} from "../services/lastfm.service.js";
import { parseLimit, parsePeriod } from "../utils/query.js";

export async function nowPlaying(req: Request, res: Response) {
    const data = await getNowPlaying();

    if (!data) {
        return res.status(404).json({ message: "No hay canciones en el historial" });
    }

    res.json(data);
}

export async function topArtists(req: Request, res: Response) {
    const period = parsePeriod(req.query.period);
    const limit = parseLimit(req.query.limit);

    res.json(await getTopArtists(period, limit));
}

export async function topTracks(req: Request, res: Response) {
    const period = parsePeriod(req.query.period);
    const limit = parseLimit(req.query.limit);

    res.json(await getTopTracks(period, limit));
}

export async function listeningTime(req: Request, res: Response) {
    const period = parsePeriod(req.query.period);

    res.json(await getListeningTime(period));
}

export async function summary(req: Request, res: Response) {
    const period = parsePeriod(req.query.period);

    res.json(await getSummary(period));
}