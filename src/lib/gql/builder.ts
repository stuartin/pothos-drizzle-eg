import SchemaBuilder from '@pothos/core'
import DrizzlePlugin from '@pothos/plugin-drizzle';
import RelayPlugin from '@pothos/plugin-relay';
import { DateTimeResolver } from 'graphql-scalars';
import * as schema from "#lib/db/schema"
import { drizzle } from 'drizzle-orm/d1';
import { Context } from 'src';

interface Root<T> {
    Context: T
    DrizzleSchema: typeof schema;
    Scalars: {
        ID: {
            Output: string;
            Input: string;
        };
        DateTime: {
            Output: Date;
            Input: Date;
        }
    }
}

export const builder = new SchemaBuilder<Root<Context>>({
    plugins: [DrizzlePlugin, RelayPlugin],
    drizzle: {
        client: (ctx) => ctx.db,
        schema
    }
})

builder.queryType()
// builder.mutationType()
builder.addScalarType('DateTime', DateTimeResolver);

