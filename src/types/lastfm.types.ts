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

export interface NowPlaying {
    isPlaying: boolean;
    name: string;
    artist: string;
    album: string | null;
    image: string | null;
    url: string;
    playedAt: string | null;
}