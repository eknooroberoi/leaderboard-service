export default interface IDatasource {
    initialize(): Promise<IDatasource>;
    destroy(): Promise<void>;
    createQueryBuilder(): any;
    getRepository(daoClass: any): any;
    manager: any;
}
