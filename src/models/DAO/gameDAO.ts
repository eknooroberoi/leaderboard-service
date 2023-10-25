import { Entity, PrimaryColumn, Column } from "typeorm"

/*
CREATE TABLE game (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) DEFAULT 'game',
    PRIMARY KEY (id)
);
 */
@Entity({name: "game"})
export default class GameDAO{
    @PrimaryColumn({type : "varchar", length : 50})
    id: string = "";

    @Column({type : "varchar", length : 255, default : "game"})
    name: string = "";
}