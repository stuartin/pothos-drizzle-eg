import { getPlatformProxy } from "wrangler";
import * as schema from "./schema"
import { reset, seed } from 'drizzle-seed'
import { drizzle } from "drizzle-orm/d1";

async function main() {
    const platform = await getPlatformProxy<CloudflareBindings>()
    const db = drizzle(platform.env.DB, { schema })

    console.log("Starting seed.")

    // @ts-expect-error 
    await reset(db, schema)
    // @ts-expect-error 
    await seed(db, schema)

    console.log("Done.")
}

main()