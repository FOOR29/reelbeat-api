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