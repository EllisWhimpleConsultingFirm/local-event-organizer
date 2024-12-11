/**
 * Used to return a type or an error
 */
export type Result<T> = T & { error?: never } | { error: string };

/**
 * Takes in a result object and returns whether or not there is an error in it
 * @param result
 * @return boolean
 */
export function isError<T>(result: Result<T>): result is { error: string } {
    return 'error' in result;
}