import { YogaInitialContext, createYoga } from "graphql-yoga";
import { gqlSchema } from "./gql.schema"
import { initContextCache } from "@pothos/core";

export type Context = YogaInitialContext & CloudflareBindings

const yoga = createYoga<CloudflareBindings>({
    schema: gqlSchema,
    maskedErrors: false,
    context: async (initialContext: YogaInitialContext) => ({
        ...initialContext,
        ...initContextCache(),
        // ...(await validateSessionTokenCookie(initialContext.request.cookieStore))
    })
})

export default { fetch: yoga.fetch }