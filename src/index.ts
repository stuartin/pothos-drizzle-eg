import { schema } from './lib/gql/schema';
import { createYoga } from 'graphql-yoga';
import * as dbSchema from './lib/db/schema'
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';

export type Context = CloudflareBindings & {
    db: DrizzleD1Database<typeof dbSchema>
}

const yoga = createYoga<CloudflareBindings>({
    schema,
    context: (ctx) => ({
        db: drizzle(ctx.DB, { schema: dbSchema })
    })
})

export default { fetch: yoga.fetch }
