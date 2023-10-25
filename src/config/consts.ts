export interface IConsts {
    kafkaConsumerConfig: {
        brokers: string[],
        groupId: string,
        topics: string[],
        clientId: string,
        fromBeginning: boolean,
        batchAutoResolve: boolean
    },
    mySQLConfig: {
        host: string,
        port: number,
        userName: string,
        password: string,
        database: string,
    }
}

/*
Note:- In some places we have hardcoded password in code, this is done for convenience.
In production a proper solution for secrets management.
As an example we can use :-https://github.com/hashicorp/vault
 */
export const consts: IConsts = {
    kafkaConsumerConfig: {
        brokers: ["localhost:9092"],
        groupId: "leaderboard-service",
        topics: ["game-scores"],
        clientId: "leaderboard-service",
        fromBeginning: true,
        batchAutoResolve: false
    },
    mySQLConfig: {
        host: "localhost",
        port: 3306,
        userName: "default_user",
        password: "default_pwd",
        database: "leaderboard_service"
    }
}