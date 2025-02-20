import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { int, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const game = sqliteTable("game", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    teamId: text("team_id").notNull().references(() => team.id),
    complete: int("complete", { mode: 'boolean' }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const team = sqliteTable("team", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

// export const player = sqliteTable("player", {
//     id: text("id").primaryKey().$defaultFn(() => createId()),
//     teamId: text("team_id").notNull().references(() => team.id),
//     name: text("name").notNull(),
//     number: int("number").notNull(),
//     updatedAt: integer("updated_at", { mode: "timestamp" })
//         .notNull()
//         .$defaultFn(() => new Date())
//         .$onUpdateFn(() => new Date()),
//     createdAt: integer("created_at", { mode: "timestamp" })
//         .notNull()
//         .$defaultFn(() => new Date()),
// });

// export const point = sqliteTable("point", {
//     id: text("id").primaryKey().$defaultFn(() => createId()),
//     teamId: text("team_id").notNull().references(() => team.id),
//     gameId: text("game_id").notNull().references(() => game.id),
//     scored: int("scored", { mode: 'boolean' }).notNull(),
//     startedOnOffense: int("started_on_offense", { mode: 'boolean' }).notNull(),
//     updatedAt: integer("updated_at", { mode: "timestamp" })
//         .notNull()
//         .$defaultFn(() => new Date())
//         .$onUpdateFn(() => new Date()),
//     createdAt: integer("created_at", { mode: "timestamp" })
//         .notNull()
//         .$defaultFn(() => new Date()),
// });

// export const playerToPoint = sqliteTable("player_to_point", {
//     id: text("id").unique().notNull().$defaultFn(() => createId()),
//     playerId: text("player_id")
//         .notNull()
//         .references(() => player.id, { onDelete: "cascade" }),
//     pointId: text("point_id")
//         .notNull()
//         .references(() => point.id),
// }, (table) => [
//     primaryKey({ name: "id", columns: [table.id, table.playerId, table.pointId] })
// ]);

// export const playerToPointRelations = relations(playerToPoint, ({ one }) => ({
//     player: one(player, {
//         fields: [playerToPoint.playerId],
//         references: [player.id],
//     }),
//     point: one(point, {
//         fields: [playerToPoint.pointId],
//         references: [point.id],
//     }),
// }));

// export const playerRelations = relations(player, ({ many, one }) => ({
//     team: one(team, {
//         fields: [player.teamId],
//         references: [team.id]
//     }),
//     points: many(playerToPoint)
// }));

export const teamRelations = relations(team, ({ many }) => ({
    games: many(game),
}));

export const gameRelations = relations(game, ({ many, one }) => ({
    team: one(team, {
        fields: [game.teamId],
        references: [team.id]
    })
}));

// export const pointRelations = relations(point, ({ one, many }) => ({
//     players: many(playerToPoint),
//     team: one(team, {
//         fields: [point.teamId],
//         references: [team.id],
//     }),
//     game: one(game, {
//         fields: [point.gameId],
//         references: [game.id],
//     })
// }));