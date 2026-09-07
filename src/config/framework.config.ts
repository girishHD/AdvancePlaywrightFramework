/**
 * Framework-wide configuration flags.
 * Set ATTACH_SCREENSHOTS=true in .env to enable screenshot attachment
 * on every step and on test failure. When false, no screenshots are attached.
 *
 * Uses a getter so the env var is read at access time (after dotenv.config()
 * has run), not at module-load time when it may still be undefined.
 */
export const frameworkConfig = {
    get attachScreenshots(): boolean {
        return process.env.ATTACH_SCREENSHOTS?.toLowerCase() === 'true';
    },
} as const;
