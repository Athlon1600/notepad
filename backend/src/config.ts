require('dotenv').config();

type ConfigType = {
    port: number,
    environment: string
}

export const Config: ConfigType = {
    port: process.env['PORT'] ? +process.env['PORT'] : 3000,
    environment: process.env['NODE_ENV'] || 'development'
}