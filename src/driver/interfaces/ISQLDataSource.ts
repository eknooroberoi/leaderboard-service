import IDatasource from './IDatasource';

export default interface ISQLDataSource {
    getDBImpl(): IDatasource;
    shutdown(): Promise<void>;
}
