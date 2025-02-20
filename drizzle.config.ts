import { defineConfig } from 'drizzle-kit';
import fs from 'node:fs';
import path from 'node:path';

function getLocalD1DB() {
    try {
        const basePath = path.resolve('.wrangler');
        const dbFile = fs
            .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
            .find((f) => f.endsWith('.sqlite'));

        if (!dbFile) {
            throw new Error(`.sqlite file not found in ${basePath}`);
        }

        const url = path.resolve(basePath, dbFile);
        return `file:${url}`;
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Error  ${err.message}`);
        }
    }
}

export default defineConfig({
    dialect: 'sqlite',
    schema: './src/lib/db/schema.ts',
    out: './src/lib/db/migrations',
    dbCredentials: {
        url: getLocalD1DB()!
    }
})
