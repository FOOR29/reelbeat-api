// ---- CRUDO: lo que manda Last.fm ----
export interface LastfmRecentTrack {
    name: string;
    url: string;
    artist: { "#text": string };
    album: { "#text": string };
    image: { size: string; "#text": string }[];
    date?: { uts: string };
    "@attr"?: { nowplaying: string };
}

export interface LastfmRecentTracksResponse {
    recenttracks: {
        track: LastfmRecentTrack[];
    };
}

export interface LastfmTopArtist {
    name: string;
    url: string;
    playcount: string;
    "@attr": { rank: string };
}

export interface LastfmTopArtistsResponse {
    topartists: {
        artist: LastfmTopArtist[];
    };
}

export interface LastfmTopTrack {
    name: string;
    url: string;
    duration: string;
    playcount: string;
    artist: { name: string };
    "@attr": { rank: string };
}

export interface LastfmTopTracksResponse {
    toptracks: {
        track: LastfmTopTrack[];
        "@attr": { totalPages: string };
    };
}

// ---- LIMPIO: lo que entrega la API ----
export interface NowPlaying {
    isPlaying: boolean;
    name: string;
    artist: string;
    album: string | null;
    image: string | null;
    url: string;
    playedAt: string | null;
}

export interface TopArtist {
    rank: number;
    name: string;
    playcount: number;
    url: string;
}

export interface TopTrack {
    rank: number;
    name: string;
    artist: string;
    playcount: number;
    durationSeconds: number;
    url: string;
}

export interface ListeningTime {
    period: string;
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    tracksCounted: number;
    tracksWithoutDuration: number;
}