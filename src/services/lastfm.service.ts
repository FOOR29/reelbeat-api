import { env } from "../config/env.js";
import type { LastfmRecentTracksResponse, NowPlaying } from "../types/lastfm.types.js";

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

async function callLastfm<T>(
    method: string,
    params: Record<string, string> = {},
): Promise<T> {
    const query = new URLSearchParams({
        method,
        user: env.lastfmUser,
        api_key: env.lastfmApiKey,
        format: "json",
        ...params,
    });

    const response = await fetch(`${BASE_URL}?${query}`);

    if (!response.ok) {
        throw new Error(`Last.fm respondió con status ${response.status}`);
    }

    return (await response.json()) as T;
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
    const body = await callLastfm<LastfmRecentTracksResponse>("user.getrecenttracks", {
        limit: "1",
    });

    const track = body.recenttracks.track[0];

    if (!track) {
        return null;
    }

    const uts = track.date?.uts;

    return {
        isPlaying: track["@attr"]?.nowplaying === "true",
        name: track.name,
        artist: track.artist["#text"],
        album: track.album["#text"] || null,
        image: track.image.at(-1)?.["#text"] || null,
        url: track.url,
        playedAt: uts ? new Date(Number(uts) * 1000).toISOString() : null,
    };
}