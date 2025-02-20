import { schema } from './lib/gql/schema';
import { createYoga } from 'graphql-yoga';

const yoga = createYoga<CloudflareBindings>({
    schema
})

export default { fetch: yoga.fetch }
