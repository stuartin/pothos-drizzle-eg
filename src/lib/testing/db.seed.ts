import { getPlatformProxy } from "wrangler";
import * as schema from "./db.schema"
import { seed } from 'drizzle-seed'
import { drizzle } from "drizzle-orm/d1";

async function main() {
    const platform = await getPlatformProxy<CloudflareBindings>()
    const db = drizzle(platform.env.DB, { schema })

    // @ts-expect-error 
    await seed(db, schema)
}

main()