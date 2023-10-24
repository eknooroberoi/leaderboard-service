export default class KafkaConsumerConfigDTO{
    private _clientId: string = "DEFAULT_CLIENT_ID";
    private _brokers: string[];
    private _groupId: string;
    private _topics: string[];
    private _fromBeginning: boolean = false; // default to 'latest' for offsetReset
    private _batchAutoResolve: boolean = false;

    constructor(brokers: string[], groupId: string, topics: string[]) {
        this._brokers = brokers;
        this._groupId = groupId;
        this._topics = topics;
    }

    withClientId(clientId: string): KafkaConsumerConfigDTO{
        this._clientId = clientId;
        return this;
    }

    withFromBeginning(fromBeginning: boolean): KafkaConsumerConfigDTO{
        this._fromBeginning = fromBeginning;
        return this;
    }

    withBatchAutoResolve(batchAutoResolve: boolean): KafkaConsumerConfigDTO{
        this._batchAutoResolve = batchAutoResolve;
        return this;
    }

    get clientId(): string {
        return this._clientId;
    }

    get brokers(): string[] {
        return this._brokers;
    }

    get groupId(): string {
        return this._groupId;
    }

    get topics(): string[] {
        return this._topics;
    }

    get fromBeginning(): boolean {
        return this._fromBeginning;
    }

    get batchAutoResolve(): boolean {
        return this._batchAutoResolve;
    }
}