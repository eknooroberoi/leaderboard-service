import {Column, Entity, PrimaryColumn} from "typeorm";
import Persistable from "./persistable";

/*
CREATE TABLE user (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'gameUser',
    PRIMARY KEY (id)
);
 */
@Entity({name: "user"})
export default class UserDAO implements Persistable{
    @PrimaryColumn({type : "varchar", length : 50})
    id: string = "";

    @Column({type : "varchar", length : 255, default : "gameUser"})
    name: string = "";
}