import { Entity, PrimaryColumn, Column } from "typeorm"
import Persistable from "./persistable";

/*
CREATE TABLE game (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'game',
    PRIMARY KEY (id)
);
 */
@Entity({name: "game"})
export default class GameDAO implements Persistable{
    @PrimaryColumn({type : "varchar", length : 50})
    id: string = "";

    @Column({type : "varchar", length : 255, default : "game"})
    name: string = "";
}