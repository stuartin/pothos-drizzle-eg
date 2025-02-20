import { builder } from "#lib/gql/builder";
import "./example.schema";

export const schema = builder.toSchema();