import type { Request, Response } from "express";
import { getNowPlaying } from "../services/lastfm.service.js";

export async function nowPlaying(req: Request, res: Response) {
    try {
        const data = await getNowPlaying();

        if (!data) {
            return res.status(404).json({ message: "No hay canciones en el historial" });
        }

        res.json(data);
    } catch (error) {
        console.error("Error consultando Last.fm:", error);
        res.status(502).json({ message: "No se pudo consultar Last.fm" });
    }
}