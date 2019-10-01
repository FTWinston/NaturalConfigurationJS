export interface IParserError {
    message: string
    startIndex: number;
    length: number;
}

export function createError(message: string, startIndex: number = 0, length: number = -1): IParserError {
    return {
        message,
        startIndex,
        length,
    };
}