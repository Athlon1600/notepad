require('dotenv').config();

type ConfigType = {
    port: number,
    environment: string,
    noteIdMaxLen: number,
    slowHashSalt: string,
    fastHashSalt: string
}

export const Config: ConfigType = {
    port: process.env['PORT'] ? +process.env['PORT'] : 3000,
    environment: process.env['NODE_ENV'] || 'development',

    noteIdMaxLen: process.env['NOTE_ID_MAX_LEN'] ? +process.env['NOTE_ID_MAX_LEN'] : 16,

    // A good rule of thumb is to use a salt that is the same size as the output of the hash function.
    // For example, the output of SHA256 is 256 bits (32 bytes), so the salt should be at least 32 random bytes.
    slowHashSalt: process.env['SLOW_HASH_SALT'] || '',
    fastHashSalt: process.env['FAST_HASH_SALT'] || '',
}