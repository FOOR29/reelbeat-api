function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Falta la variable ${name} en el .env`);
    }

    return value;
}

export const env = {
    port: Number(process.env.PORT) || 3000,
    lastfmApiKey: requireEnv("LASTFM_API_KEY"),
    lastfmUser: requireEnv("LASTFM_USER"),
    traktClientId: requireEnv("TRAKT_CLIENT_ID"),
    traktUser: requireEnv("TRAKT_USER"),
};