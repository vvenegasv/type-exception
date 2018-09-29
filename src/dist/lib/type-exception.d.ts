export declare class TypeException extends Error {
    private _innerError?;
    private _aggregateErrors?;
    private _data;
    constructor(message: string, innerError?: Error, aggregateErrors?: Error[]);
    innerError(): Error | null;
    aggregateErrors(): Error[] | null;
    data(): {
        [id: string]: any;
    };
    tryAddData(key: string, value: any): boolean;
    toString(): string;
    toStringWithData(value: Error, tabIndex?: number): string;
    private getStringFromBaseError;
}
//# sourceMappingURL=type-exception.d.ts.map