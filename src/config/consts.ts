export interface IConsts {
    kafkaConsumerConfig: {
        brokers: string[],
        groupId: string,
        topics: string[],
        clientId: string,
        fromBeginning: boolean,
        batchAutoResolve: boolean
    }
}

export const consts: IConsts = {
    kafkaConsumerConfig: {
        brokers: ["localhost:9092"],
        groupId: "leaderboard-service",
        topics: ["game-scores"],
        clientId: "leaderboard-service",
        fromBeginning: true,
        batchAutoResolve: false
    }
}