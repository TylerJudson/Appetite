/**
 * Filters an object by some predicate
 * @param obj The object to filter
 * @param predicate The way to filter the object
 * @returns A filtered object
 */
export function filterObject(obj: Object, predicate: (value: any) => boolean) {
    return Object.keys(obj)
        .filter(key => predicate(obj[key as keyof typeof obj]))
        .reduce((res, key) => Object.assign(res, { [key]: obj[key as keyof typeof obj] }), {});
}