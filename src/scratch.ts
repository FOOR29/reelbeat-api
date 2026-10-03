interface RecentMovie {
    title: string;
    year: number;
    rating: number;
    watchedAt: string;
    poster: string | null;
}

interface TraktHistoryItem {
    watched_at: string;
    movie: {
        title: string;
        year: number;
        rating: number;
        images: {
            poster: string[]
        }
    }
}

//agregar https en caso de no tenerlo
function buildPosterUrl(path: string | undefined): string | null {
    if (!path) {
        return null;
    }
    if (path.startsWith("https://")) {
        return path;
    }
    return `https://${path}`;
}

//funcion parea limpiar lo recibido
function cleanMovie(item: TraktHistoryItem): RecentMovie {
    return {
        title: item.movie.title,
        year: item.movie.year,
        rating: Math.round(item.movie.rating * 10) / 10, //redondear a dos decimales
        watchedAt: item.watched_at,
        poster: buildPosterUrl(item.movie.images.poster[0]),
    };
}

const rawHistory: TraktHistoryItem[] = [
    {
        watched_at: "2026-09-22T10:18:00.000Z",
        movie: {
            title: "Resident Evil",
            year: 2026,
            rating: 7.764341354370117,
            images: {
                poster: [
                    ],
            },
        },
    },
];


for (const item of rawHistory) {
    const clean = cleanMovie(item);
    console.log(clean);
}