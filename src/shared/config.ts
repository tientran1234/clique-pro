import { config } from 'dotenv'

config()

const envConfig = {
    // Application
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),

    // Database
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',

    // CORS
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:5175',

    // JWT (for future auth implementation)
    JWT_SECRET: process.env.JWT_SECRET || 'clique-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
}

export default envConfig
