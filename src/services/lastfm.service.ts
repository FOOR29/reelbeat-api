import { env } from "../config/env.js";
import { ExternalApiError } from "../errors/app-errors.js";
import type {
    LastfmRecentTracksResponse,
    LastfmTopArtistsResponse,
    LastfmTopTracksResponse,
    ListeningTime,
    NowPlaying,
    TopArtist,
    TopTrack,
} from "../types/lastfm.types.js";

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
        throw new ExternalApiError("Last.fm", response.status);
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

export async function getTopArtists(period: string, limit: number): Promise<TopArtist[]> {
    const body = await callLastfm<LastfmTopArtistsResponse>("user.gettopartists", {
        period,
        limit: String(limit),
    });

    return body.topartists.artist.map((artist) => ({
        rank: Number(artist["@attr"].rank),
        name: artist.name,
        playcount: Number(artist.playcount),
        url: artist.url,
    }));
}

export async function getTopTracks(period: string, limit: number): Promise<TopTrack[]> {
    const body = await callLastfm<LastfmTopTracksResponse>("user.gettoptracks", {
        period,
        limit: String(limit),
    });

    return body.toptracks.track.map((track) => ({
        rank: Number(track["@attr"].rank),
        name: track.name,
        artist: track.artist.name,
        playcount: Number(track.playcount),
        durationSeconds: Number(track.duration),
        url: track.url,
    }));
}

export async function getListeningTime(period: string): Promise<ListeningTime> {
    const PAGE_SIZE = 200;

    let totalSeconds = 0;
    let tracksCounted = 0;
    let tracksWithoutDuration = 0;
    let totalPages = 1;

    for (let page = 1; page <= totalPages; page++) {
        const body = await callLastfm<LastfmTopTracksResponse>("user.gettoptracks", {
            period,
            limit: String(PAGE_SIZE),
            page: String(page),
        });

        totalPages = Number(body.toptracks["@attr"].totalPages);

        for (const track of body.toptracks.track) {
            const duration = Number(track.duration);
            const playcount = Number(track.playcount);

            if (duration > 0) {
                totalSeconds += duration * playcount;
                tracksCounted++;
            } else {
                tracksWithoutDuration++;
            }
        }
    }

    return {
        period,
        totalSeconds,
        totalMinutes: Math.round(totalSeconds / 60),
        totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
        tracksCounted,
        tracksWithoutDuration,
    };
}

export async function getSummary(period: string) {
    const [topArtists, topTracks, listeningTime] = await Promise.all([
        getTopArtists(period, 5),
        getTopTracks(period, 5),
        getListeningTime(period),
    ]);

    return {
        period,
        listeningTime,
        topArtist: topArtists[0] ?? null,
        topArtists,
        topTrack: topTracks[0] ?? null,
        topTracks,
    };
}