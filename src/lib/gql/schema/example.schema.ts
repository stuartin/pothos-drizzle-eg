import { drizzle } from "drizzle-orm/d1";
import { builder } from "../builder";
import * as schema from "../../db/schema"


const GameRef = builder.drizzleNode('game', {
    id: { column: ({ id }) => id },
    name: 'Game',
    fields: (t) => ({
        team: t.relation('team'),
        complete: t.exposeBoolean('complete'),
    }),
});

builder.queryFields((t) => ({
    games: t.drizzleConnection({
        type: 'game',
        resolve: (query, parent, args, context) => {
            const db = drizzle(context.DB, { schema })
            return db.query.game.findMany(query())
        }
    }),
    game: t.drizzleField({
        type: 'game',
        args: { id: t.arg.id({ required: true }) },
        nullable: true,
        resolve: (query, parent, args, context) => {
            const db = drizzle(context.DB, { schema })
            return db.query.game.findFirst(query({
                where: (fields, { eq }) => eq(fields.id, args.id)
            }))
        }
    })
}));


const PlayerRef = builder.drizzleNode('player', {
    id: { column: ({ id }) => id },
    name: 'Player',
    fields: (t) => ({
        name: t.exposeString('name'),
        number: t.exposeInt('number'),
        points: t.relatedConnection('points')
    }),
});

builder.queryFields((t) => ({
    players: t.drizzleConnection({
        type: 'player',
        resolve: (query, parent, args, context) => {
            const db = drizzle(context.DB, { schema })
            return db.query.player.findMany(query())
        }
    }),
    player: t.drizzleField({
        type: 'player',
        args: { id: t.arg.id({ required: true }) },
        nullable: true,
        resolve: (query, parent, args, context) => {
            const db = drizzle(context.DB, { schema })
            return db.query.player.findFirst(query({
                where: (fields, { eq }) => eq(fields.id, args.id)
            }))
        }
    })
}));

const TeamRef = builder.drizzleNode('team', {
    id: { column: ({ id }) => id },
    name: 'Team',
    fields: (t) => ({
        name: t.exposeString('name'),
        games: t.relatedConnection('games'),
    }),
});

builder.queryFields((t) => ({
    teams: t.drizzleConnection({
        type: 'team',
        resolve: (query, parent, args, context) => {
            const db = drizzle(context.DB, { schema })
            return db.query.team.findMany(query())
        }
    }),
    team: t.drizzleField({
        type: 'team',
        args: { id: t.arg.id({ required: true }) },
        nullable: true,
        resolve: (query, parent, args, context) => {
            const db = drizzle(context.DB, { schema })
            return db.query.team.findFirst(query({
                where: (fields, { eq }) => eq(fields.id, args.id)
            }))
        }
    })
}));

const PointRef = builder.drizzleNode('point', {
    id: { column: ({ id }) => id },
    name: 'Point',
    fields: (t) => ({
        startedOnOffense: t.exposeBoolean('startedOnOffense'),
        scored: t.exposeBoolean('scored'),
        team: t.relation('team')
    }),
});

const PlayerToPointRef = builder.drizzleNode('playerToPoint', {
    id: { column: ({ id }) => id },
    name: 'PlayerToPoint'
})

export const gqlSchema = builder.toSchema();