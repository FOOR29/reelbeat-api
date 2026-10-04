import type { DeezerArtistSearchResponse } from "../types/deezer.types.js";

const BASE_URL = "https://api.deezer.com";

// guarda lo que ya buscamos para no repetir llamadas (se borra al reiniciar el servidor)
const imageCache = new Map<string, string | null>();

export async function getArtistImage(name: string): Promise<string | null> {
    const key = name.toLowerCase();

    if (imageCache.has(key)) {
        return imageCache.get(key) ?? null;
    }

    try {
        const query = new URLSearchParams({ q: name, limit: "5" });

        const response = await fetch(`${BASE_URL}/search/artist?${query}`, {
            signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
            return null;
        }

        const body = (await response.json()) as DeezerArtistSearchResponse;

        // si Deezer responde algo raro (ej. un error), no lo guardamos en el cache
        if (!body.data) {
            return null;
        }

        // solo aceptamos el artista cuyo nombre coincide exacto
        const match = body.data.find((artist) => artist.name.toLowerCase() === key);
        const image = match?.picture_big ?? null;

        imageCache.set(key, image);
        return image;
    } catch {
        console.warn(`No se pudo traer la imagen de ${name}`);
        return null;
    }
}