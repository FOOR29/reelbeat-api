export interface TraktHistoryItem {
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

export interface RecentMovie {
    title: string;
    year: number;
    rating: number;
    watchedAt: string;
    poster: string | null;
}