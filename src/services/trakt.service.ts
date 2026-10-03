import { env } from "../config/env.js";
import { ExternalApiError } from "../errors/app-errors.js";
import type { RecentMovie, TraktHistoryItem } from "../types/trakt.types.js";

// agrega https:// a la portada si no lo trae
function buildPosterUrl(path: string | undefined): string | null {
    if (!path) {
        return null;
    }

    if (path.startsWith("https://")) {
        return path;
    }

    return `https://${path}`;
}

// convierte una película cruda de Trakt en el objeto limpio de tu API
function cleanMovie(item: TraktHistoryItem): RecentMovie {
    return {
        title: item.movie.title,
        year: item.movie.year,
        rating: Math.round(item.movie.rating * 10) / 10,
        watchedAt: item.watched_at,
        poster: buildPosterUrl(item.movie.images.poster[0]),
    };
}

const BASE_URL = "https://api.trakt.tv";

export async function getRecentMovies(limit: number): Promise<RecentMovie[]> {
    const url = `${BASE_URL}/users/${env.traktUser}/history/movies?extended=full&limit=${limit}`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            // Trakt usa Cloudflare y bloquea peticiones sin User-Agent (da 403)
            "User-Agent": "reelbeat-api/1.0",
            "trakt-api-version": "2",
            "trakt-api-key": env.traktClientId,
        },
    });

    if (!response.ok) {
        throw new ExternalApiError("Trakt", response.status);
    }
    const data = (await response.json()) as TraktHistoryItem[];

    return data.map((item) => cleanMovie(item));
}