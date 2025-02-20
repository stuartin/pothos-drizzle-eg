import SchemaBuilder from '@pothos/core'
import ZodValidationPlugin from '@pothos/plugin-zod'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import DrizzlePlugin from '@pothos/plugin-drizzle';
import RelayPlugin from '@pothos/plugin-relay';
import { GraphQLError } from 'graphql'
import { Context } from './index'
import * as dbSchema from "./db.schema"
import { drizzle } from 'drizzle-orm/d1';
import { DateTimeResolver } from 'graphql-scalars';

interface Root<T> {
    Context: T
    Scalars: {
        DateTime: {
            Output: Date;
            Input: Date;
        }
    }
    DrizzleSchema: typeof dbSchema;
    AuthScopes: {
        user: boolean
    }
}

export const builder = new SchemaBuilder<Root<Context>>({
    plugins: [
        ScopeAuthPlugin,
        DrizzlePlugin,
        RelayPlugin,
        ZodValidationPlugin,
    ],
    relay: {
        encodeGlobalID: (typename: string, id: string | number | bigint) => `${typename}:${id}`,
        decodeGlobalID: (globalID: string) => {
            const [typename, id] = globalID.split(':');
            return { typename, id };
        },
    },
    drizzle: {
        client: (ctx) => drizzle(ctx.DB, { schema: dbSchema }),
        schema: dbSchema
    },
    scopeAuth: {
        authScopes: (ctx) => ({
            user: true
        }),
        unauthorizedError: (parent, context, info, result) => new GraphQLError(
            result.message,
            {
                extensions: {
                    code: 'UNAUTHORIZED',
                    http: { status: 401 },
                }
            }
        ),
    }
})

builder.addScalarType('DateTime', DateTimeResolver);
builder.queryType()
// builder.mutationType()