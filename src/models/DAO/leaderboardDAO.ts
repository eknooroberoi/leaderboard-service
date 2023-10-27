import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import GameDAO from "./gameDAO";
import UserDAO from "./userDAO";
import Persistable from "./persistable";

/*
CREATE TABLE leaderboard (
    user_id VARCHAR(50) NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    updated_at BIGINT NOT NULL,
    PRIMARY KEY (game_id, user_id),

    -- Add a composite secondary index for querying top n scores within a game
    -- Secondary migration is creation using migration ../../driver/mysql/1698269779298-IndexCreation.ts
    INDEX idx_game_score_updated_at (game_id, score DESC, updated_at ASC),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (game_id) REFERENCES game(id)
);
 */
@Entity({name: "leaderboard"})
@Index("idx_game_score_updated_at", {synchronize : false})
export default class LeaderboardDAO implements Persistable{
    @PrimaryColumn({type : "varchar", length : 50, name : 'game_id'})
    @ManyToOne(_ => GameDAO)
    @JoinColumn({name : 'game_id'})
    gameId: string = "";

    @PrimaryColumn({type : "varchar", length : 50, name : 'user_id'})
    @ManyToOne(_ => UserDAO)
    @JoinColumn({name : 'user_id'})
    userId: string = "";

    @Column({type : "int"})
    score: number = 0;

    // Note :- bigint column type, doesn't fit into the regular `number` type and maps property to a `string` instead
    @Column({type : "bigint", name : "updated_at"})
    updatedAt: string = "0";

}