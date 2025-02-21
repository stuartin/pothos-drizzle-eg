import { builder } from "../builder";

// drizzleNode > gives a unique globalID for ALL nodes
// drizzleObject > just expose the object

// Cursor based pagination
// - drizzleConnection > drizzleNode OR drizzleObject (must have an id field)
// - query must have orderBy
const GameRef = builder.drizzleObject('game', {
    name: 'Game',
    fields: (t) => ({
        id: t.exposeID("id"),
        team: t.relation('team'),
        complete: t.exposeBoolean('complete'),
    }),
});

builder.queryFields((t) => ({
    games: t.drizzleConnection({
        type: 'game',
        resolve: (query, parent, args, ctx) =>
            ctx.db.query.game.findMany(query({
                orderBy: (game) => ({
                    desc: game.createdAt,
                }),
            }))

    }),
    game: t.drizzleField({
        type: 'game',
        args: { id: t.arg.id({ required: true }) },
        nullable: true,
        resolve: (query, parent, args, ctx) => {
            return ctx.db.query.game.findFirst(query({
                where: (fields, { eq }) => eq(fields.id, args.id)
            }))
        }
    })
}));

// Limit/Offset pagination
// - drizzleField > drizzleObject (needs limit/offset args)
// - uses normal db query
// - no relay stuff (connection/edges)

const PlayerRef = builder.drizzleObject('player', {
    name: 'Player',
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString('name'),
        number: t.exposeInt('number'),
        points: t.relatedConnection('points')
    }),
});

builder.queryFields((t) => ({
    players: t.drizzleField({
        type: ['player'],
        args: {
            limit: t.arg.int(),
            offset: t.arg.int()
        },
        resolve: (query, parent, args, ctx) => ctx.db.query.player.findMany(query({
            limit: args.limit ?? 2,
            offset: args.offset ?? 0,
            orderBy: (player, { desc }) => desc(player.createdAt)
        }))
    }),
    player: t.drizzleField({
        type: 'player',
        args: { id: t.arg.id({ required: true }) },
        nullable: true,
        resolve: (query, parent, args, ctx) => ctx.db.query.player.findFirst(query({
            where: (fields, { eq }) => eq(fields.id, args.id)
        }))
    })
}));

const PointRef = builder.drizzleObject('point', {
    name: 'Point',
    fields: (t) => ({
        id: t.exposeID("id"),
        startedOnOffense: t.exposeBoolean('startedOnOffense'),
        scored: t.exposeBoolean('scored'),
        team: t.relation('team')
    }),
});

const TeamRef = builder.drizzleObject('team', {
    name: 'Team',
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString('name'),
        games: t.relatedConnection('games'),
    }),
});

builder.queryFields((t) => ({
    teams: t.drizzleConnection({
        type: 'team',
        resolve: (query, parent, args, ctx) => ctx.db.query.team.findMany(query())
    }),
    team: t.drizzleField({
        type: 'team',
        args: { id: t.arg.id({ required: true }) },
        nullable: true,
        resolve: (query, parent, args, ctx) => ctx.db.query.team.findFirst(query({
            where: (fields, { eq }) => eq(fields.id, args.id)
        }))
    })
}));

const PlayerToPointRef = builder.drizzleObject('playerToPoint', {
    name: 'PlayerToPoint',
    fields: (t) => ({
        player: t.relation('player'),
        point: t.relation('point')
    })
})