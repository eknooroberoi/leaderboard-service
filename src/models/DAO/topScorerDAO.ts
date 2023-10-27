import {TopScorerDTO} from "../index";
import Persistable from "./persistable";

// TopScorerDAO extends TopScorerDTO and implements persitance
export default class TopScorerDAO extends TopScorerDTO implements Persistable{
    constructor(userId: string, userName: string, score: number) {
        super(userId, userName, score);
    }
}