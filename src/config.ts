import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

const { NODE_ENV, PORT, DB_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, APP_TOKEN, ORIGIN } = process.env;

export const appConfig = {
    accessTokenSecret: ACCESS_TOKEN_SECRET || '',
    appToken: APP_TOKEN || '',
    dbUrl: DB_URL || '',
    nodeEnv: NODE_ENV || 'developement',
    origin: ORIGIN || '*',
    port: PORT || 3000,
    refreshTokenSecret: REFRESH_TOKEN_SECRET || '',
}