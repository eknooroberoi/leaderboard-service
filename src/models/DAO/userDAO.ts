import {Column, Entity, PrimaryColumn} from "typeorm";

/*
CREATE TABLE user (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) DEFAULT 'gameUser',
    PRIMARY KEY (id)
);
 */
@Entity({name: "user"})
export default class UserDAO{
    @PrimaryColumn({type : "varchar", length : 50})
    id: string = "";

    @Column({type : "varchar", length : 255, default : "gameUser"})
    name: string = "";
}