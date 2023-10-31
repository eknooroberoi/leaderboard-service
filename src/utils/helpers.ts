export function wrapInPromise<T>(value: T): Promise<T> {
    return Promise.resolve(value);
}
